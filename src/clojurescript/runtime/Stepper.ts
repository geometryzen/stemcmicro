/* eslint-disable @typescript-eslint/no-unused-vars */
import { create_sym, Sym } from "math-expression-atoms";
import { LambdaExpr } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { Cons, is_atom, is_cons, items_to_cons, nil, U } from "math-expression-tree";
import { ExprEngineListener, UndeclaredVars } from "../../api";
import { create_env, EnvOptions } from "../../env/env";
import { ALL_FEATURES, ExtensionEnv } from "../../env/ExtensionEnv";
import { Stack } from "../../env/Stack";
import { is_sym } from "../../operators/sym/is_sym";
import { is_cons_opr_eq_sym } from "../../predicates/is_cons_opr_eq_sym";
import { init_env } from "../../runtime/script_engine";
import { BaseEnv } from "./BaseEnv";
import { DerivedScope } from "./DerivedEnv";
import { Eval_1_args } from "./Eval_1_args";
import { Eval_2_args } from "./Eval_2_args";
import { Eval_3_args } from "./Eval_3_args";
import { Eval_abs } from "./Eval_abs";
import { Eval_add } from "./Eval_add";
import { Eval_module } from "./Eval_module";
import { Eval_multiply } from "./Eval_multiply";
import { Eval_n_args } from "./Eval_n_args";
import { Eval_power } from "./Eval_power";
import { Eval_relational_expr } from "./Eval_relational_expr";
import { eval_setq } from "./eval_setq";
import { Eval_taylor } from "./Eval_taylor";
import { Eval_test } from "./Eval_test";
import { Eval_transpose } from "./Eval_transpose";
import { Eval_unit } from "./Eval_unit";
import { Eval_v_args } from "./Eval_v_args";
import { Eval_zero } from "./Eval_zero";

const STEP_ERROR = { 'STEP_ERROR': true };
const MODULE = create_sym('module');

function is_module(x: Cons): boolean {
    return is_cons_opr_eq_sym(x, MODULE);
}

function stepper_opr_key(x: Cons): string {
    if (is_cons(x)) {
        const candidate = x.opr;
        if (is_sym(candidate)) {
            return candidate.key();
        }
        else {
            throw new Error();
        }
    }
    else {
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
    getBinding(sym: string | Sym): U;
    getSymbolUsrFunc(sym: Sym): U;
    isConsSymbol(sym: Sym): boolean;
    isUserSymbol(sym: Sym): boolean;
    setBinding(sym: Sym, binding: U): void;
    setSymbolUsrFunc(sym: Sym, usrfunc: U): void;
    valueOf(expr: U): U;
    /*
    parentScope: Scope | null;
    strict: boolean;
    */
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
    constructor(readonly input: U, readonly $: Scope) {
    }
}

class Task {
    static pid = 0;
    time: number;
    pid: number;
    constructor(public functionRef: unknown, public argsArray: unknown, public scope: Scope, public node: U, public interval: number) {
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
    const scope: Scope = top.$;
    const value = scope.valueOf(atom);
    try {
        handler.atom(value, atom);
    }
    finally {
        top.value = value;
    }
}

class BlackHole implements StepperHandler {
    atom(after: U, before: U): void {
    }
}

const BLACK_HOLE = new BlackHole();

export interface StepperConfig {
    allowUndeclaredVars: boolean;
}

function env_options_from_stepper_options(options?: Partial<StepperConfig>): EnvOptions {
    if (options) {
        const config: EnvOptions = {
            allowUndeclaredVars: (typeof options.allowUndeclaredVars === 'number') ? options.allowUndeclaredVars : UndeclaredVars.Nil,
            dependencies: ALL_FEATURES
        };
        return config;

    }
    else {
        const config: EnvOptions = {
            allowUndeclaredVars: UndeclaredVars.Nil,
            dependencies: ALL_FEATURES
        };
        return config;
    }
}

export class Stepper {
    POLYFILL_TIMEOUT = 1000;
    #paused: boolean = false;
    #currStepper: Stepper;
    #stack: Stack<State> = new Stack();
    #tasks: Task[] = [];
    #stepFunctions: { [type: string]: StepFunction };
    #getterStep: boolean = false;
    #setterStep: boolean = false;
    #value: unknown;
    #globalThing: Thing;
    #globalScope: Scope;
    #initFunc: ((runner: Stepper, globalObject: Thing) => void) | undefined;
    #coreEnv: ExtensionEnv;
    /**
     * @param module
     * @param options 
     * @param initFunc 
     */
    constructor(module: Cons, options?: Partial<StepperConfig>, initFunc?: (runner: Stepper, globalObject: Thing) => void) {
        this.#currStepper = this;
        this.#stepFunctions = Object.create(null);
        this.#initFunc = initFunc;
        this.#initStepFunctions();
        this.#coreEnv = create_env(env_options_from_stepper_options(options));
        init_env(this.#coreEnv);
        this.#globalScope = this.createScope(null, new BaseEnv(this.#coreEnv, this.createObjectProto(null)));
        this.#globalThing = this.#globalScope.thing;
        this.#runPolyfills();
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
        if (typeof proto !== 'object') {
            throw Error('Non object prototype');
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
    defineFunction(name: string, lambda: LambdaExpr): void {
        const match = items_to_cons(create_sym(name));
        this.#coreEnv.defineFunction(match, lambda);
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
            let state: State | null = stack.top;
            input = state.input;
            // console.lg(`node => ${node}`);
            if (!state || (is_cons(input) && is_module(input) && state.done)) {
                if (!this.#tasks.length) {
                    // Module complete and no queued tasks.  We're done!
                    return false;
                }
                state = this.#nextTask();
                if (!state) {
                    // console.lg("Module complete, queued tasks, but nothing to run right now.");
                    return true;
                }
            }
            const prevStepper = this.#currStepper;
            this.#currStepper = this;
            try {
                if (is_cons(input)) {
                    const key = stepper_opr_key(input);

                    const stepFn = this.#stepFunctions[key];
                    if (stepFn) {
                        // console.lg(`Calling StepFunction for key ${JSON.stringify(key)} with node ${node}`);
                        const nextState = stepFn(input, stack, state);
                        if (nextState) {
                            stack.push(nextState);
                        }
                    }
                    else {
                        // Assume operators that are not recognized require all their arguments to be evaluated.
                        // This allows users to create DSL languages with externally defined functions.
                        const nextState = Eval_v_args(input, stack, state);
                        if (nextState) {
                            stack.push(nextState);
                        }
                    }
                }
                else if (input.isNil()) {
                    stack.top.value = input;
                }
                else if (is_atom(input)) {
                    atomFn(input, stack, state, handler);
                }
                else {
                    throw Error(`${input} is not a cons, nil, or atom.`);
                }
            }
            catch (e) {
                if (e !== STEP_ERROR) {
                    if (this.#value !== e) {
                        this.#value = void 0;
                    }
                    throw e;
                }
            }
            finally {
                this.#currStepper = prevStepper;
                //
            }
            if (this.#getterStep) {
                // Getter from this step was not handled.
                this.#value = void 0;
                throw Error('Getter not supported in this context');
            }
            if (this.#setterStep) {
                // Setter from this step was not handled.
                this.#value = void 0;
                throw Error('Setter not supported in this context');
            }
            if (!endTime && !input.end) {
                endTime = Date.now() + this.POLYFILL_TIMEOUT;
            }
        }
        while (!input.end && endTime > Date.now());
        return true;
    }
    get stack(): Stack<State> {
        return this.#stack;
    }
    addListener(listener: ExprEngineListener): void {

    }
    removeListener(listener: ExprEngineListener): void {

    }
    #nextTask(): State | null {
        // console.lg(`Interpreter.#nextTask()`);
        const task = this.#tasks[0];
        if (!task || task.time > Date.now()) {
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
        this.#stepFunctions[native_sym(Native.add).key()] = Eval_add;
        this.#stepFunctions[native_sym(Native.multiply).key()] = Eval_multiply;
        this.#stepFunctions[native_sym(Native.lco).key()] = Eval_v_args;
        this.#stepFunctions[native_sym(Native.rco).key()] = Eval_v_args;
        this.#stepFunctions['='] = eval_setq;
        this.#stepFunctions[native_sym(Native.testeq).key()] = Eval_relational_expr;
        this.#stepFunctions[native_sym(Native.testne).key()] = Eval_relational_expr;
        this.#stepFunctions[native_sym(Native.testge).key()] = Eval_relational_expr;
        this.#stepFunctions[native_sym(Native.testgt).key()] = Eval_relational_expr;
        this.#stepFunctions[native_sym(Native.testle).key()] = Eval_relational_expr;
        this.#stepFunctions[native_sym(Native.testlt).key()] = Eval_relational_expr;
        this.#stepFunctions['module'] = Eval_module;
        this.#stepFunctions['abs'] = Eval_abs;
        this.#stepFunctions['adj'] = Eval_1_args;
        this.#stepFunctions['algebra'] = Eval_2_args;
        this.#stepFunctions['and'] = Eval_v_args;
        this.#stepFunctions['arccos'] = Eval_1_args;
        this.#stepFunctions['arccosh'] = Eval_1_args;
        this.#stepFunctions['arcsin'] = Eval_1_args;
        this.#stepFunctions['arcsinh'] = Eval_1_args;
        this.#stepFunctions['arctan'] = Eval_1_args;
        this.#stepFunctions['arctanh'] = Eval_1_args;
        this.#stepFunctions['arg'] = Eval_1_args;
        this.#stepFunctions['besselj'] = Eval_2_args;
        this.#stepFunctions['bessely'] = Eval_2_args;
        this.#stepFunctions['ceiling'] = Eval_1_args;
        this.#stepFunctions['choose'] = Eval_2_args;
        this.#stepFunctions['coeff'] = Eval_3_args;
        this.#stepFunctions['cofactor'] = Eval_3_args;
        this.#stepFunctions[native_sym(Native.component).key()] = Eval_3_args;
        this.#stepFunctions['conj'] = Eval_1_args;
        this.#stepFunctions['contract'] = Eval_v_args;
        this.#stepFunctions[native_sym(Native.cos).key()] = Eval_1_args;
        this.#stepFunctions[native_sym(Native.cosh).key()] = Eval_1_args;
        this.#stepFunctions['circexp'] = Eval_1_args;
        this.#stepFunctions['cross'] = Eval_2_args;
        this.#stepFunctions['curl'] = Eval_1_args;
        this.#stepFunctions['denominator'] = Eval_1_args;
        this.#stepFunctions['det'] = Eval_1_args;
        this.#stepFunctions['dim'] = Eval_2_args;
        this.#stepFunctions['div'] = Eval_1_args;
        this.#stepFunctions['do'] = Eval_v_args;
        this.#stepFunctions['dot'] = Eval_v_args;
        this.#stepFunctions['draw'] = Eval_2_args;
        this.#stepFunctions['eval'] = Eval_v_args;
        this.#stepFunctions['exp'] = Eval_1_args;
        this.#stepFunctions['expand'] = Eval_2_args;
        this.#stepFunctions['expcos'] = Eval_1_args;
        this.#stepFunctions['expsin'] = Eval_1_args;
        this.#stepFunctions['factor'] = Eval_v_args;
        this.#stepFunctions['factorial'] = Eval_1_args;
        this.#stepFunctions['float'] = Eval_1_args;
        this.#stepFunctions['floor'] = Eval_1_args;
        this.#stepFunctions['gcd'] = Eval_v_args;
        this.#stepFunctions['hermite'] = Eval_2_args;
        this.#stepFunctions[native_sym(Native.inner).key()] = Eval_v_args;
        this.#stepFunctions['integral'] = Eval_2_args;
        this.#stepFunctions['inv'] = Eval_1_args;
        this.#stepFunctions['isprime'] = Eval_1_args;
        this.#stepFunctions[native_sym(Native.pow).key()] = Eval_power;
        this.#stepFunctions['laguerre'] = Eval_v_args;
        this.#stepFunctions['lcm'] = Eval_v_args;
        this.#stepFunctions['leading'] = Eval_2_args;
        this.#stepFunctions['legendre'] = Eval_v_args;
        this.#stepFunctions['log'] = Eval_1_args;
        this.#stepFunctions['not'] = Eval_1_args;
        this.#stepFunctions['numerator'] = Eval_1_args;
        this.#stepFunctions['or'] = Eval_v_args;
        this.#stepFunctions[native_sym(Native.outer).key()] = Eval_v_args;
        this.#stepFunctions['prime'] = Eval_1_args;
        this.#stepFunctions['quotient'] = Eval_n_args;
        this.#stepFunctions['rank'] = Eval_1_args;
        this.#stepFunctions['rationalize'] = Eval_1_args;
        this.#stepFunctions['rect'] = Eval_1_args;
        this.#stepFunctions['roots'] = Eval_n_args;
        this.#stepFunctions['shape'] = Eval_1_args;
        this.#stepFunctions['simplify'] = Eval_1_args;
        this.#stepFunctions[native_sym(Native.sin).key()] = Eval_1_args;
        this.#stepFunctions[native_sym(Native.sinh).key()] = Eval_1_args;
        this.#stepFunctions['sqrt'] = Eval_1_args;
        this.#stepFunctions['subst'] = Eval_n_args;
        this.#stepFunctions['tan'] = Eval_1_args;
        this.#stepFunctions['tanh'] = Eval_1_args;
        this.#stepFunctions['tau'] = Eval_1_args;
        this.#stepFunctions['taylor'] = Eval_taylor;
        this.#stepFunctions['test'] = Eval_test;
        this.#stepFunctions['transpose'] = Eval_transpose;
        this.#stepFunctions['unit'] = Eval_unit;
        this.#stepFunctions['uom'] = Eval_1_args;
        this.#stepFunctions['zero'] = Eval_zero;
    }
    #runPolyfills(): void {
        /*
        this.ast = ...
        const state = new State(this.ast, this.#globalScope);
        this.#stack = [state];
        this.run();
        this.#value = void 0;
        */
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    #populateScope(node: unknown, scope: Scope): Map<string, unknown> {
        const variableCache: Map<string, unknown> = new Map();
        return variableCache;
    }
}
