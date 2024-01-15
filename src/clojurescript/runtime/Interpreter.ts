/* eslint-disable @typescript-eslint/no-unused-vars */
import { create_sym, Rat, Sym, Tensor } from "math-expression-atoms";
import { LambdaExpr } from "math-expression-context";
import { Native } from "math-expression-native";
import { Cons, is_atom, is_cons, nil, U } from "math-expression-tree";
import { create_env, EnvOptions } from "../../env/env";
import { CompareFn, ConsExpr, Directive, ExprComparator, ExtensionEnv, KeywordRunner, Operator, OperatorBuilder, Predicates, PrintHandler } from "../../env/ExtensionEnv";
import { Stack } from "../../env/Stack";
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

export interface Scope extends ExtensionEnv {
    thing: Thing;
    /*
    parentScope: Scope | null;
    strict: boolean;
    */
}

class BaseEnv implements Scope {
    #baseEnv: ExtensionEnv;
    constructor(baseEnv: ExtensionEnv, readonly thing: Thing) {
        this.#baseEnv = baseEnv;
    }
    getPrintHandler(): PrintHandler {
        throw new Error("Method not implemented.");
    }
    setPrintHandler(handler: PrintHandler): void {
        throw new Error("Method not implemented.");
    }
    abs(expr: U): U {
        throw new Error("Method not implemented.");
    }
    algebra(metric: Tensor<U>, labels: Tensor<U>): Tensor<U> {
        throw new Error("Method not implemented.");
    }
    add(...args: U[]): U {
        throw new Error("Method not implemented.");
    }
    arccos(expr: U): U {
        throw new Error("Method not implemented.");
    }
    arcsin(expr: U): U {
        throw new Error("Method not implemented.");
    }
    arctan(expr: U): U {
        throw new Error("Method not implemented.");
    }
    arg(expr: U): U {
        throw new Error("Method not implemented.");
    }
    clock(expr: U): U {
        throw new Error("Method not implemented.");
    }
    conj(expr: U): U {
        throw new Error("Method not implemented.");
    }
    cos(expr: U): U {
        throw new Error("Method not implemented.");
    }
    evaluate(opr: Native, ...args: U[]): U {
        return this.#baseEnv.evaluate(opr, ...args);
    }
    exp(expr: U): U {
        throw new Error("Method not implemented.");
    }
    clearBindings(): void {
        throw new Error("Method not implemented.");
    }
    clearOperators(): void {
        throw new Error("Method not implemented.");
    }
    compareFn(sym: Sym): CompareFn {
        throw new Error("Method not implemented.");
    }
    component(tensor: Tensor<U>, indices: U): U {
        throw new Error("Method not implemented.");
    }
    defineConsTransformer(opr: Sym, consExpr: ConsExpr): void {
        throw new Error("Method not implemented.");
    }
    defineFunction(match: U, lambda: LambdaExpr): void {
        throw new Error("Method not implemented.");
    }
    defineKeyword(sym: Sym, runner: KeywordRunner): void {
        throw new Error("Method not implemented.");
    }
    defineOperator(builder: OperatorBuilder<U>): void {
        throw new Error("Method not implemented.");
    }
    defineAssociative(opr: Sym, id: Rat): void {
        throw new Error("Method not implemented.");
    }
    divide(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    equals(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    factor(expr: U): U {
        throw new Error("Method not implemented.");
    }
    factorize(poly: U, x: U): U {
        throw new Error("Method not implemented.");
    }
    float(expr: U): U {
        throw new Error("Method not implemented.");
    }
    getCustomDirective(directive: string): boolean {
        throw new Error("Method not implemented.");
    }
    getDirective(directive: Directive): boolean {
        throw new Error("Method not implemented.");
    }
    getSymbolPredicates(sym: string | Sym): Predicates {
        throw new Error("Method not implemented.");
    }
    getSymbolPrintName(sym: Sym): string {
        throw new Error("Method not implemented.");
    }
    getSymbolBinding(sym: string | Sym): U {
        throw new Error("Method not implemented.");
    }
    getSymbolUsrFunc(sym: string | Sym): U {
        throw new Error("Method not implemented.");
    }
    getSymbolsInfo(): {
        sym: Sym; // at the right spot.  But 'push' & 'sort' is just two lines of code.
        // at the right spot.  But 'push' & 'sort' is just two lines of code.
        value: U;
    }[] {
        throw new Error("Method not implemented.");
    }
    buildOperators(): void {
        throw new Error("Method not implemented.");
    }
    im(expr: U): U {
        throw new Error("Method not implemented.");
    }
    inner(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    is(predicate: Sym, expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    iscomplex(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isExpanding(): boolean {
        throw new Error("Method not implemented.");
    }
    isFactoring(): boolean {
        throw new Error("Method not implemented.");
    }
    isimag(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isinfinite(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isinfinitesimal(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isminusone(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isnegative(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isone(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    ispositive(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isreal(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isscalar(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    iszero(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    log(expr: U): U {
        throw new Error("Method not implemented.");
    }
    multiply(...args: U[]): U {
        throw new Error("Method not implemented.");
    }
    negate(expr: U): U {
        throw new Error("Method not implemented.");
    }
    operatorFor(expr: U): Operator<U> | undefined {
        throw new Error("Method not implemented.");
    }
    outer(...args: U[]): U {
        throw new Error("Method not implemented.");
    }
    polar(expr: U): U {
        throw new Error("Method not implemented.");
    }
    power(base: U, expo: U): U {
        throw new Error("Method not implemented.");
    }
    re(expr: U): U {
        throw new Error("Method not implemented.");
    }
    rect(expr: U): U {
        throw new Error("Method not implemented.");
    }
    remove(varName: Sym): void {
        throw new Error("Method not implemented.");
    }
    setCustomDirective(directive: string, value: boolean): void {
        throw new Error("Method not implemented.");
    }
    pushDirective(directive: Directive, value: boolean): void {
        throw new Error("Method not implemented.");
    }
    popDirective(): void {
        throw new Error("Method not implemented.");
    }
    setSymbolOrder(sym: Sym, order: ExprComparator): void {
        throw new Error("Method not implemented.");
    }
    setSymbolPredicates(sym: Sym, predicates: Partial<Predicates>): void {
        throw new Error("Method not implemented.");
    }
    setSymbolPrintName(sym: Sym, printName: string): void {
        throw new Error("Method not implemented.");
    }
    setSymbolBinding(sym: string | Sym, binding: U): void {
        throw new Error("Method not implemented.");
    }
    setSymbolUsrFunc(sym: string | Sym, usrfunc: U): void {
        throw new Error("Method not implemented.");
    }
    simplify(expr: U): U {
        throw new Error("Method not implemented.");
    }
    sin(expr: U): U {
        throw new Error("Method not implemented.");
    }
    sqrt(expr: U): U {
        throw new Error("Method not implemented.");
    }
    st(expr: U): U {
        throw new Error("Method not implemented.");
    }
    subst(newExpr: U, oldExpr: U, expr: U): U {
        throw new Error("Method not implemented.");
    }
    subtract(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    toInfixString(expr: U): string {
        throw new Error("Method not implemented.");
    }
    toLatexString(expr: U): string {
        throw new Error("Method not implemented.");
    }
    toSExprString(expr: U): string {
        throw new Error("Method not implemented.");
    }
    transform(expr: U): [number, U] {
        throw new Error("Method not implemented.");
    }
    valueOf(expr: U): U {
        throw new Error("Method not implemented.");
    }
    getBinding(printname: string): U {
        throw new Error("Method not implemented.");
    }
    setBinding(printname: string, binding: U): void {
        throw new Error("Method not implemented.");
    }
    getUsrFunc(printname: string): U {
        throw new Error("Method not implemented.");
    }
    setUsrFunc(printname: string, usrfunc: U): void {
        throw new Error("Method not implemented.");
    }
}

class DerivedEnv implements Scope {
    constructor(readonly parentEnv: Scope, readonly strict: boolean, readonly thing: Thing) {

    }
    getPrintHandler(): PrintHandler {
        throw new Error("Method not implemented.");
    }
    setPrintHandler(handler: PrintHandler): void {
        throw new Error("Method not implemented.");
    }
    abs(expr: U): U {
        throw new Error("Method not implemented.");
    }
    algebra(metric: Tensor<U>, labels: Tensor<U>): Tensor<U> {
        throw new Error("Method not implemented.");
    }
    add(...args: U[]): U {
        throw new Error("Method not implemented.");
    }
    arccos(expr: U): U {
        throw new Error("Method not implemented.");
    }
    arcsin(expr: U): U {
        throw new Error("Method not implemented.");
    }
    arctan(expr: U): U {
        throw new Error("Method not implemented.");
    }
    arg(expr: U): U {
        throw new Error("Method not implemented.");
    }
    clock(expr: U): U {
        throw new Error("Method not implemented.");
    }
    conj(expr: U): U {
        throw new Error("Method not implemented.");
    }
    cos(expr: U): U {
        throw new Error("Method not implemented.");
    }
    evaluate(opr: Native, ...args: U[]): U {
        return this.parentEnv.evaluate(opr, ...args);
    }
    exp(expr: U): U {
        throw new Error("Method not implemented.");
    }
    clearBindings(): void {
        throw new Error("Method not implemented.");
    }
    clearOperators(): void {
        throw new Error("Method not implemented.");
    }
    compareFn(sym: Sym): CompareFn {
        throw new Error("Method not implemented.");
    }
    component(tensor: Tensor<U>, indices: U): U {
        throw new Error("Method not implemented.");
    }
    defineConsTransformer(opr: Sym, consExpr: ConsExpr): void {
        throw new Error("Method not implemented.");
    }
    defineFunction(match: U, lambda: LambdaExpr): void {
        throw new Error("Method not implemented.");
    }
    defineKeyword(sym: Sym, runner: KeywordRunner): void {
        throw new Error("Method not implemented.");
    }
    defineOperator(builder: OperatorBuilder<U>): void {
        throw new Error("Method not implemented.");
    }
    defineAssociative(opr: Sym, id: Rat): void {
        throw new Error("Method not implemented.");
    }
    divide(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    equals(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    factor(expr: U): U {
        throw new Error("Method not implemented.");
    }
    factorize(poly: U, x: U): U {
        throw new Error("Method not implemented.");
    }
    float(expr: U): U {
        throw new Error("Method not implemented.");
    }
    getCustomDirective(directive: string): boolean {
        throw new Error("Method not implemented.");
    }
    getDirective(directive: Directive): boolean {
        throw new Error("Method not implemented.");
    }
    getSymbolPredicates(sym: string | Sym): Predicates {
        throw new Error("Method not implemented.");
    }
    getSymbolPrintName(sym: Sym): string {
        throw new Error("Method not implemented.");
    }
    getSymbolBinding(sym: string | Sym): U {
        throw new Error("Method not implemented.");
    }
    getSymbolUsrFunc(sym: string | Sym): U {
        throw new Error("Method not implemented.");
    }
    getSymbolsInfo(): { sym: Sym; value: U; }[] {
        throw new Error("Method not implemented.");
    }
    buildOperators(): void {
        throw new Error("Method not implemented.");
    }
    im(expr: U): U {
        throw new Error("Method not implemented.");
    }
    inner(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    is(predicate: Sym, expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    iscomplex(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isExpanding(): boolean {
        throw new Error("Method not implemented.");
    }
    isFactoring(): boolean {
        throw new Error("Method not implemented.");
    }
    isimag(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isinfinite(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isinfinitesimal(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isminusone(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isnegative(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isone(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    ispositive(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isreal(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    isscalar(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    iszero(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    log(expr: U): U {
        throw new Error("Method not implemented.");
    }
    multiply(...args: U[]): U {
        throw new Error("Method not implemented.");
    }
    negate(expr: U): U {
        throw new Error("Method not implemented.");
    }
    operatorFor(expr: U): Operator<U> | undefined {
        throw new Error("Method not implemented.");
    }
    outer(...args: U[]): U {
        throw new Error("Method not implemented.");
    }
    polar(expr: U): U {
        throw new Error("Method not implemented.");
    }
    power(base: U, expo: U): U {
        throw new Error("Method not implemented.");
    }
    re(expr: U): U {
        throw new Error("Method not implemented.");
    }
    rect(expr: U): U {
        throw new Error("Method not implemented.");
    }
    remove(varName: Sym): void {
        throw new Error("Method not implemented.");
    }
    setCustomDirective(directive: string, value: boolean): void {
        throw new Error("Method not implemented.");
    }
    pushDirective(directive: Directive, value: boolean): void {
        throw new Error("Method not implemented.");
    }
    popDirective(): void {
        throw new Error("Method not implemented.");
    }
    setSymbolOrder(sym: Sym, order: ExprComparator): void {
        throw new Error("Method not implemented.");
    }
    setSymbolPredicates(sym: Sym, predicates: Partial<Predicates>): void {
        throw new Error("Method not implemented.");
    }
    setSymbolPrintName(sym: Sym, printName: string): void {
        throw new Error("Method not implemented.");
    }
    setSymbolBinding(sym: string | Sym, binding: U): void {
        throw new Error("Method not implemented.");
    }
    setSymbolUsrFunc(sym: string | Sym, usrfunc: U): void {
        throw new Error("Method not implemented.");
    }
    simplify(expr: U): U {
        throw new Error("Method not implemented.");
    }
    sin(expr: U): U {
        throw new Error("Method not implemented.");
    }
    sqrt(expr: U): U {
        throw new Error("Method not implemented.");
    }
    st(expr: U): U {
        throw new Error("Method not implemented.");
    }
    subst(newExpr: U, oldExpr: U, expr: U): U {
        throw new Error("Method not implemented.");
    }
    subtract(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    toInfixString(expr: U): string {
        throw new Error("Method not implemented.");
    }
    toLatexString(expr: U): string {
        throw new Error("Method not implemented.");
    }
    toSExprString(expr: U): string {
        throw new Error("Method not implemented.");
    }
    transform(expr: U): [number, U] {
        throw new Error("Method not implemented.");
    }
    valueOf(expr: U): U {
        throw new Error("Method not implemented.");
    }
    getBinding(printname: string): U {
        throw new Error("Method not implemented.");
    }
    setBinding(printname: string, binding: U): void {
        throw new Error("Method not implemented.");
    }
    getUsrFunc(printname: string): U {
        throw new Error("Method not implemented.");
    }
    setUsrFunc(printname: string, usrfunc: U): void {
        throw new Error("Method not implemented.");
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
    /**
     * The values from the invocation of the program.
     */
    values: U[] = [];
    doneCallee: number = 0;
    doneArgs: boolean = false;
    funcThis: unknown;
    func: unknown;
    arguments: unknown;
    constructor(readonly node: U, readonly $: Scope) {
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

export type StepFunction = (node: Cons, stack: Stack<State>, state: State) => State | undefined;

export class Interpreter {
    POLYFILL_TIMEOUT = 1000;
    #paused: boolean = false;
    #currentInterpreter: Interpreter;
    #stack: Stack<State> = new Stack();
    #tasks: Task[] = [];
    #stepFunctions: { [type: string]: StepFunction };
    #getterStep: boolean = false;
    #setterStep: boolean = false;
    #value: unknown;
    #globalThing: Thing;
    #globalScope: Scope;
    #initFunc: ((runner: Interpreter, globalObject: Thing) => void) | undefined;
    /**
     * @param program
     * @param options 
     * @param initFunc 
     */
    constructor(readonly program: Cons, options?: EnvOptions, initFunc?: (runner: Interpreter, globalObject: Thing) => void) {
        this.#currentInterpreter = this;
        this.#stepFunctions = Object.create(null);
        this.#initFunc = initFunc;
        // TODO: Initialize #stepFunctions
        this.#stepFunctions['program'] = Eval_program;
        this.#stepFunctions['+'] = Eval_add;
        this.#stepFunctions['*'] = Eval_multiply;
        const coreEnv = create_env(options);
        init_env(coreEnv);
        this.#globalScope = this.createScope(null, new BaseEnv(coreEnv, this.createObjectProto(null)));
        this.#globalThing = this.#globalScope.thing;
        this.#runPolyfills();
        const state = new State(program, this.#globalScope);
        this.#stack.push(state);
    }
    createScope(node: unknown, parentScope: Scope): Scope {
        const strict = false;
        const thing = this.createObjectProto(null);
        const scope = new DerivedEnv(parentScope, strict, thing);
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
        const stack: Stack<State> = this.#stack;
        let endTime = Date.now() + this.POLYFILL_TIMEOUT;
        let node: U;
        do {
            if (this.#paused) {
                return true;
            }
            let state: State | null = stack.top;
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
                        const nextState = stepper(node, stack, state);
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
                    stack.top.value = node;
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
    getStateStack(): Stack<State> {
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
