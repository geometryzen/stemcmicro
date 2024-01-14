import { create_sym } from "math-expression-atoms";
import { Cons, is_atom, is_cons, nil, U } from "math-expression-tree";
import { create_env, EnvOptions } from "../../env/env";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_sym } from "../../operators/sym/is_sym";
import { is_cons_opr_eq_sym } from "../../predicates/is_cons_opr_eq_sym";
import { init_env } from "../../runtime/script_engine";
import { Eval_add } from "./Eval_add";
import { Eval_multiply } from "./Eval_multiply";
import { Eval_program } from "./Eval_program";

const STEP_ERROR = { 'STEP_ERROR': true };
const PROGRAM = create_sym("program");

function is_program(x: Cons): boolean {
    return is_cons_opr_eq_sym(x, PROGRAM);
}

function stepper_key(x: U): string {
    if (is_cons(x)) {
        const candidate = x.car;
        if (is_sym(candidate)) {
            return candidate.key();
        }
        else {
            throw new Error();
        }
    }
    else {
        throw new Error();
    }
}

class Thing {
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

class Scope {
    constructor(readonly parentScope: Scope | null, readonly strict: boolean, readonly thing: Thing) {

    }
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
    doneCallee: number = 0;
    doneArgs: boolean = false;
    funcThis: unknown;
    func: unknown;
    arguments: unknown;
    constructor(readonly node: U, readonly scope: Scope) {
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

export type StepFunction = (node: Cons, stack: State[], state: State, $: ExtensionEnv) => State | undefined;

export class Interpreter {
    POLYFILL_TIMEOUT = 1000;
    #paused: boolean = false;
    #currentInterpreter: Interpreter;
    #stack: State[] = [];
    #tasks: Task[] = [];
    #stepFunctions: { [type: string]: StepFunction };
    #getterStep: boolean = false;
    #setterStep: boolean = false;
    #value: unknown;
    #globalObject: Thing;
    #globalScope: Scope;
    #initFunc: ((runner: Interpreter, globalObject: Thing) => void) | undefined;
    #baseEnv: ExtensionEnv;
    /**
     * @param program
     * @param options 
     * @param initFunc 
     */
    constructor(readonly program: Cons, options?: EnvOptions, initFunc?: (runner: Interpreter, globalObject: Thing) => void) {
        this.#baseEnv = create_env(options);
        init_env(this.#baseEnv);
        this.#currentInterpreter = this;
        this.#stepFunctions = Object.create(null);
        this.#initFunc = initFunc;
        // TODO: Initialize #stepFunctions
        this.#stepFunctions['program'] = Eval_program;
        this.#stepFunctions['+'] = Eval_add;
        this.#stepFunctions['*'] = Eval_multiply;
        this.#globalScope = this.createScope(this.createScope, null);
        this.#globalObject = this.#globalScope.thing;
        this.#runPolyfills();
        const state = new State(program, this.#globalScope);
        this.#stack = [state];
    }
    createScope(node: unknown, parentScope: Scope | null): Scope {
        const strict = false;
        const thing = this.createObjectProto(null);
        const scope = new Scope(parentScope, strict, thing);
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
    initGlobal(globalObject: Thing) {
        if (this.#initFunc) {
            this.#initFunc(this, globalObject);
        }
    }
    run(): boolean {
        while (!this.#paused && this.step()) {
            // 
        }
        return this.#paused;
    }
    /**
     * Execute one step of the interpreter.
     * @returns true if a step was executed, false if no more instructions.
     */
    step(): boolean {
        const stack = this.#stack;
        let endTime = Date.now() + this.POLYFILL_TIMEOUT;
        let node: U;
        do {
            if (this.#paused) {
                return true;
            }
            let state: State | null = stack[stack.length - 1];
            node = state.node;
            // console.lg(`node => ${node}`);
            if (!state || (is_cons(node) && is_program(node) && state.done)) {
                if (!this.#tasks.length) {
                    // Main program complete and no queued tasks.  We're done!
                    return false;
                }
                state = this.#nextTask();
                if (!state) {
                    // console.lg("Main program complete, queued tasks, but nothing to run right now.");
                    return true;
                }
            }
            const previousInterpreter = this.#currentInterpreter;
            this.#currentInterpreter = this;
            try {
                if (is_cons(node)) {
                    const key = stepper_key(node);

                    const stepper = this.#stepFunctions[key];
                    if (stepper) {
                        // console.lg(`Calling StepFunction for key ${JSON.stringify(key)} with node ${node}`);
                        const nextState = stepper(node, stack, state, this.#baseEnv);
                        if (nextState) {
                            stack.push(nextState);
                        }
                    }
                    else {
                        throw Error(`operator ${key} is not supported.`);
                    }
                }
                else if (is_atom(node)) {
                    stack.pop();
                    stack[stack.length - 1].value = node;
                }
                else {
                    throw Error(`${node} is not a Cons`);
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
                this.#currentInterpreter = previousInterpreter;
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
            if (!endTime && !node.end) {
                endTime = Date.now() + this.POLYFILL_TIMEOUT;
            }
        }
        while (!node.end && endTime > Date.now());
        return true;
    }
    getStateStack(): State[] {
        return this.#stack;
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
            state.funcThis = this.#globalObject;
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
