/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert_sym, create_sym, is_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext, LambdaExpr } from "@stemcmicro/context";
import { hash_candidates, hash_nonop_cons } from "@stemcmicro/hashing";
import { is_cons_opr_eq_sym } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { ProgramIOListener, Stack } from "@stemcmicro/stack";
import { Cons, is_atom, is_cons, nil, U } from "@stemcmicro/tree";
import { BaseEnv } from "./BaseEnv";
import { DerivedScope } from "./DerivedEnv";
import { step_add } from "./step_add";
import { step_module } from "./step_module";
import { step_setq } from "./step_setq";

const STEP_ERROR = { STEP_ERROR: true };
const MODULE = create_sym("module");

function is_cons_opr_eq_module(x: Cons): boolean {
    return is_cons_opr_eq_sym(x, MODULE);
}

/**
 * Return the key property of the operator of the cons expression.
 * In all other cases, an exception is raised.
 */
function assert_cons_opr(x: Cons): Sym | never {
    if (is_cons(x)) {
        const candidate = x.opr;
        if (is_sym(candidate)) {
            return candidate;
        } else {
            throw new Error();
        }
    } else {
        // Unlikely to be nil.
        throw new Error();
    }
}

export class Thing {
    getter: unknown;
    setter: unknown;
    properties: unknown;
    constructor(readonly proto: unknown) {
        this.getter = Object.create(null);
        this.setter = Object.create(null);
        this.properties = Object.create(null);
        this.proto = proto;
    }
}

export interface Scope {
    thing: Thing;
    evaluate(opr: Native, ...args: U[]): U;
    hasBinding(sym: Sym, target: Cons): boolean;
    getBinding(sym: Sym, target: Cons): U;
    setBinding(sym: Sym, binding: U): void;
    hasUserFunction(sym: Sym): boolean;
    getUserFunction(sym: Sym): U;
    setUserFunction(sym: Sym, usrfunc: U): void;
    valueOf(expr: U): U;
}

export class State {
    /**
     * For use by evaluators. Let's the evaluator know it is being called for the first time.
     * The evaluator is responsible for updating the value to false if it chooses to use it.
     */
    firstTime = true;
    /**
     * MUST be initialized to false.
     */
    done: boolean = false;
    doneArg: boolean[] = [];
    /**
     * For use by evaluators to keep track of evaluated arguments.
     */
    argValues: U[] = [];
    /**
     * Contains the value from the previous invocation of the evaluator.
     */
    value: U = nil;
    /**
     * The inputs from the invocation of the module.
     */
    inputs: U[] = [];
    /**
     * The values from the invocation of the module.
     */
    values: U[] = [];
    doneCallee: number = 0;
    doneArgs: boolean = false;
    funcThis: unknown;
    func: unknown;
    arguments: unknown;
    constructor(
        readonly input: U,
        readonly scope: Scope
    ) { }
}

/**
 * A task supports the implementation of functions such as setTimeout and setInterval.
 */
class Task {
    static pid = 0;
    time: number;
    pid: number;
    constructor(
        public functionRef: unknown,
        public argsArray: unknown,
        public scope: Scope,
        public node: U,
        public interval: number
    ) {
        this.pid = ++Task.pid;
        this.time = 0;
    }
}

type StepFunction = (node: Cons, stack: Stack<State>, state: State) => State | undefined;

export interface StepperHandler {
    atom(after: U, before: U): void;
}

function atomFn(atom: U, stack: Stack<State>, state: State, handler: StepperHandler): void {
    stack.pop();
    const top: State = stack.top;
    const scope: Scope = top.scope;
    const value = scope.valueOf(atom);
    try {
        handler.atom(value, atom);
    } finally {
        top.value = value;
    }
}

class BlackHole implements StepperHandler {
    atom(after: U, before: U): void { }
}

const BLACK_HOLE = new BlackHole();

export interface StepperConfig {
    allowUndeclaredVars: boolean;
}

export class Stepper {
    POLYFILL_TIMEOUT = 1000;
    #paused: boolean = false;
    #currStepper: Stepper;
    #stack: Stack<State> = new Stack();
    #tasks: Task[] = [];
    readonly #stepFunctions: Map<string, StepFunction> = new Map();
    #getterStep: boolean = false;
    #setterStep: boolean = false;
    #value: unknown;
    #globalThing: Thing;
    #globalScope: Scope;
    #initFunc: ((runner: Stepper, globalObject: Thing) => void) | undefined;
    #coreEnv: ExprContext;
    /**
     * @param module
     * @param options
     * @param initFunc
     */
    constructor(module: Cons, options?: Partial<StepperConfig>, initFunc?: (runner: Stepper, globalObject: Thing) => void) {
        this.#currStepper = this;
        this.#initFunc = initFunc;
        this.#initStepFunctions();
        // this.#coreEnv = create_env(env_options_from_stepper_options(options));
        // init_env(this.#coreEnv);
        this.#globalScope = this.createScope(null, new BaseEnv(this.#coreEnv, this.createObjectProto(null)));
        this.#globalThing = this.#globalScope.thing;
        const state = new State(module, this.#globalScope);
        this.#stack.push(state);
    }
    createScope(node: unknown, parentScope: Scope): Scope {
        const strict = false;
        const thing = this.createObjectProto(null);
        const scope = new DerivedScope(parentScope, strict, thing);
        if (!parentScope) {
            this.initGlobal(scope.thing);
        }
        this.#populateScope(node, scope);
        return scope;
    }
    createObjectProto(proto: unknown | null): Thing {
        if (typeof proto !== "object") {
            throw Error("Non object prototype");
        }
        const obj = new Thing(proto);
        /*
        if (this.isa(obj, this.ERROR)) {
            // Record this object as being an error so that its toString function can
            // process it correctly (toString has no access to the interpreter and could
            // not otherwise determine that the object is an error).
            obj.class = 'Error';
        }
        */
        return obj;
    }
    defineFunction(name: Sym, lambda: LambdaExpr): void {
        assert_sym(name);
        throw new Error("Stepper.defineFunction is not implemented");
        // const match = items_to_cons(name);
        // this.#coreEnv..defineFunction(match, lambda);
    }
    initGlobal(globalObject: Thing) {
        if (this.#initFunc) {
            this.#initFunc(this, globalObject);
        }
    }
    run(handler: StepperHandler = BLACK_HOLE): boolean {
        while (!this.#paused && this.next(handler)) {
            //
        }
        return this.#paused;
    }
    #nextState(): State | null {
        const stack: Stack<State> = this.#stack;
        const state = stack.top;
        if (state) {
            const input = state.input;
            // console.lg(`node => ${node}`);
            if (is_cons(input) && is_cons_opr_eq_module(input) && state.done) {
                return this.#nextTask();
            } else {
                return state;
            }
        } else {
            return this.#nextTask();
        }
    }
    /**
     * Execute one step of the interpreter.
     * @returns true if there are more instructions to execute.
     */
    next(handler: StepperHandler = BLACK_HOLE): boolean {
        const stack: Stack<State> = this.#stack;
        let endTime = Date.now() + this.POLYFILL_TIMEOUT;
        let input: U;
        do {
            if (this.#paused) {
                return true;
            }
            const state: State | null = this.#nextState();
            if (state) {
                input = state.input;
                // console.lg(`node => ${node}`);
                if (is_cons(input) && is_cons_opr_eq_module(input) && state.done) {
                    if (!this.#tasks.length) {
                        // Module complete and no queued tasks.  We're done!
                        return false;
                    }
                }
                const prevStepper = this.#currStepper;
                this.#currStepper = this;
                try {
                    if (is_cons(input)) {
                        let found = false;
                        const opr = assert_cons_opr(input);
                        const keys = hash_candidates(opr, input);
                        for (const key of keys) {
                            if (this.#stepFunctions.has(key)) {
                                const stepFn = this.#stepFunctions.get(key);
                                if (stepFn) {
                                    // console.lg(`Calling StepFunction for key ${JSON.stringify(key)} with node ${node}`);
                                    const nextState = stepFn(input, stack, state);
                                    if (nextState) {
                                        stack.push(nextState);
                                    }
                                    found=true;
                                    break;
                                }
                            }
                        }
                        if (!found) {
                            // return false;
                            throw Error(`${input} has no handler.`);
                        }
                    } else if (input.isnil) {
                        stack.top.value = input;
                    } else if (is_atom(input)) {
                        atomFn(input, stack, state, handler);
                    } else {
                        throw Error(`${input} is not a cons, nil, or atom.`);
                    }
                } catch (e) {
                    if (e !== STEP_ERROR) {
                        if (this.#value !== e) {
                            this.#value = void 0;
                        }
                        throw e;
                    }
                } finally {
                    this.#currStepper = prevStepper;
                    //
                }
                if (this.#getterStep) {
                    // Getter from this step was not handled.
                    this.#value = void 0;
                    throw Error("Getter not supported in this context");
                }
                if (this.#setterStep) {
                    // Setter from this step was not handled.
                    this.#value = void 0;
                    throw Error("Setter not supported in this context");
                }
                if (!endTime && !input.end) {
                    endTime = Date.now() + this.POLYFILL_TIMEOUT;
                }
            } else {
                return false;
            }
        } while (!input.end && endTime > Date.now());
        return true;
    }
    get stack(): Stack<State> {
        return this.#stack;
    }
    addListener(listener: ProgramIOListener): void { }
    removeListener(listener: ProgramIOListener): void { }
    #nextTask(): State | null {
        // console.lg(`Interpreter.#nextTask()`);
        if (this.#tasks.length > 0) {
            const task = this.#tasks[0];
            if (task.time > Date.now()) {
                return null;
            }
            // Found a task that's due to run.
            this.#tasks.shift();
            if (task.interval >= 0) {
                this.#scheduleTask(task, task.interval);
            }
            const state = new State(task.node, task.scope);
            if (task.functionRef) {
                // setTimeout/setInterval with a function reference.
                state.doneCallee = 2;
                state.funcThis = this.#globalThing;
                state.func = task.functionRef;
                state.doneArgs = true;
                state.arguments = task.argsArray;
            }
            return state;
        } else {
            return null;
        }
    }
    #scheduleTask(task: Task, delay: number): void {
        task.time = Date.now() + delay;
        // For optimum efficiency we could do a binary search and inject the task
        // at the right spot.  But 'push' & 'sort' is just two lines of code.
        this.#tasks.push(task);
        this.#tasks.sort(function (a, b) {
            return a.time - b.time;
        });
    }
    #initStepFunctions(): void {
        // Notice here that the handlers are keyed only by the operator.key, so we don't have operator overloading.
        this.#stepFunctions.set(hash_nonop_cons(native_sym(Native.add)), step_add);
        // this.#stepFunctions[native_sym(Native.multiply).key()] = step_multiply;
        // this.#stepFunctions[native_sym(Native.lco).key()] = step_v_args;
        // this.#stepFunctions[native_sym(Native.rco).key()] = step_v_args;
        this.#stepFunctions.set(hash_nonop_cons(native_sym(Native.assign)), step_setq);
        // this.#stepFunctions[native_sym(Native.testeq).key()] = step_relational_expr;
        // this.#stepFunctions[native_sym(Native.testne).key()] = step_relational_expr;
        // this.#stepFunctions[native_sym(Native.testge).key()] = step_relational_expr;
        // this.#stepFunctions[native_sym(Native.testgt).key()] = step_relational_expr;
        // this.#stepFunctions[native_sym(Native.testle).key()] = step_relational_expr;
        // this.#stepFunctions[native_sym(Native.testlt).key()] = step_relational_expr;
        this.#stepFunctions.set(hash_nonop_cons(create_sym("module")), step_module);
        // this.#stepFunctions["abs"] = step_abs;
        // this.#stepFunctions["adj"] = step_1_args;
        // this.#stepFunctions["algebra"] = step_2_args;
        // this.#stepFunctions["and"] = step_v_args;
        // this.#stepFunctions["arccos"] = step_1_args;
        // this.#stepFunctions["arccosh"] = step_1_args;
        // this.#stepFunctions["arcsin"] = step_1_args;
        // this.#stepFunctions["arcsinh"] = step_1_args;
        // this.#stepFunctions["arctan"] = step_1_args;
        // this.#stepFunctions["arctanh"] = step_1_args;
        // this.#stepFunctions["arg"] = step_1_args;
        // this.#stepFunctions["besselj"] = step_2_args;
        // this.#stepFunctions["bessely"] = step_2_args;
        // this.#stepFunctions["ceiling"] = step_1_args;
        // this.#stepFunctions["choose"] = step_2_args;
        // this.#stepFunctions["coeff"] = step_3_args;
        // this.#stepFunctions["cofactor"] = step_3_args;
        // this.#stepFunctions[native_sym(Native.component).key()] = step_3_args;
        // this.#stepFunctions["conj"] = step_1_args;
        // this.#stepFunctions["contract"] = step_v_args;
        // this.#stepFunctions[native_sym(Native.cos).key()] = step_1_args;
        // this.#stepFunctions[native_sym(Native.cosh).key()] = step_1_args;
        // this.#stepFunctions["circexp"] = step_1_args;
        // this.#stepFunctions["cross"] = step_2_args;
        // this.#stepFunctions["curl"] = step_1_args;
        // this.#stepFunctions["denominator"] = step_1_args;
        // this.#stepFunctions["det"] = step_1_args;
        // this.#stepFunctions["dim"] = step_2_args;
        // this.#stepFunctions["div"] = step_1_args;
        // this.#stepFunctions["do"] = step_v_args;
        // this.#stepFunctions["dot"] = step_v_args;
        // this.#stepFunctions["draw"] = step_2_args;
        // this.#stepFunctions["eval"] = step_v_args;
        // this.#stepFunctions["exp"] = step_1_args;
        // this.#stepFunctions["expand"] = step_2_args;
        // this.#stepFunctions["expcos"] = step_1_args;
        // this.#stepFunctions["expsin"] = step_1_args;
        // this.#stepFunctions["factor"] = step_v_args;
        // this.#stepFunctions["factorial"] = step_1_args;
        // this.#stepFunctions["float"] = step_1_args;
        // this.#stepFunctions["floor"] = step_1_args;
        // this.#stepFunctions["gcd"] = step_v_args;
        // this.#stepFunctions["hermite"] = step_2_args;
        // this.#stepFunctions[native_sym(Native.inner).key()] = step_v_args;
        // this.#stepFunctions["integral"] = step_2_args;
        // this.#stepFunctions["inv"] = step_1_args;
        // this.#stepFunctions["isprime"] = step_1_args;
        // this.#stepFunctions[native_sym(Native.pow).key()] = step_power;
        // this.#stepFunctions["laguerre"] = step_v_args;
        // this.#stepFunctions["lcm"] = step_v_args;
        // this.#stepFunctions["leading"] = step_2_args;
        // this.#stepFunctions["legendre"] = step_v_args;
        // this.#stepFunctions["log"] = step_1_args;
        // this.#stepFunctions["not"] = step_1_args;
        // this.#stepFunctions["numerator"] = step_1_args;
        // this.#stepFunctions["or"] = step_v_args;
        // this.#stepFunctions[native_sym(Native.outer).key()] = step_v_args;
        // this.#stepFunctions["prime"] = step_1_args;
        // this.#stepFunctions["quotient"] = step_n_args;
        // this.#stepFunctions["rank"] = step_1_args;
        // this.#stepFunctions["rationalize"] = step_1_args;
        // this.#stepFunctions["rect"] = step_1_args;
        // this.#stepFunctions["roots"] = step_n_args;
        // this.#stepFunctions["shape"] = step_1_args;
        // this.#stepFunctions["simplify"] = step_1_args;
        // this.#stepFunctions[native_sym(Native.sin).key()] = step_1_args;
        // this.#stepFunctions[native_sym(Native.sinh).key()] = step_1_args;
        // this.#stepFunctions["sqrt"] = step_1_args;
        // this.#stepFunctions["subst"] = step_n_args;
        // this.#stepFunctions["tan"] = step_1_args;
        // this.#stepFunctions["tanh"] = step_1_args;
        // this.#stepFunctions["tau"] = step_1_args;
        // this.#stepFunctions["taylor"] = step_taylor;
        // this.#stepFunctions["test"] = step_test;
        // this.#stepFunctions["transpose"] = step_transpose;
        // this.#stepFunctions["unit"] = step_unit;
        // this.#stepFunctions["uom"] = step_1_args;
        // this.#stepFunctions["zero"] = step_zero;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    #populateScope(node: unknown, scope: Scope): Map<string, unknown> {
        const variableCache: Map<string, unknown> = new Map();
        return variableCache;
    }
}
