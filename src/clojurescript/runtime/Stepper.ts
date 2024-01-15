/* eslint-disable @typescript-eslint/no-unused-vars */
import { create_sym, Rat, Sym, Tensor } from "math-expression-atoms";
import { LambdaExpr } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { Cons, is_atom, is_cons, is_nil, nil, U } from "math-expression-tree";
import { create_env, EnvOptions } from "../../env/env";
import { CompareFn, ConsExpr, Directive, ExprComparator, ExtensionEnv, KeywordRunner, Operator, OperatorBuilder, Predicates, PrintHandler } from "../../env/ExtensionEnv";
import { Stack } from "../../env/Stack";
import { is_sym } from "../../operators/sym/is_sym";
import { is_cons_opr_eq_sym } from "../../predicates/is_cons_opr_eq_sym";
import { init_env } from "../../runtime/script_engine";
import { Eval_1_args } from "./Eval_1_args";
import { Eval_2_args } from "./Eval_2_args";
import { Eval_3_args } from "./Eval_3_args";
import { Eval_abs } from "./Eval_abs";
import { Eval_add } from "./Eval_add";
import { Eval_assign } from "./Eval_assign";
import { Eval_module } from "./Eval_module";
import { Eval_multiply } from "./Eval_multiply";
import { Eval_n_args } from "./Eval_n_args";
import { Eval_power } from "./Eval_power";
import { Eval_taylor } from "./Eval_taylor";
import { Eval_test } from "./Eval_test";
import { Eval_relational_expr } from "./Eval_relational_expr";
import { Eval_transpose } from "./Eval_transpose";
import { Eval_unit } from "./Eval_unit";
import { Eval_v_args } from "./Eval_v_args";
import { Eval_zero } from "./Eval_zero";

const STEP_ERROR = { 'STEP_ERROR': true };
const MODULE = create_sym('module');

function is_module(x: Cons): boolean {
    return is_cons_opr_eq_sym(x, MODULE);
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

export interface Scope {
    thing: Thing;
    evaluate(opr: Native, ...args: U[]): U;
    getSymbolBinding(sym: string | Sym): U;
    operatorFor(expr: U): Operator<U> | undefined;
    setSymbolBinding(sym: string | Sym, binding: U): void;
    valueOf(expr: U): U;
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
        return this.#baseEnv.getSymbolBinding(sym);
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
        return this.#baseEnv.operatorFor(expr);
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
        this.#baseEnv.setSymbolBinding(sym, binding);
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
        return this.#baseEnv.valueOf(expr);
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
        return this.parentEnv.getSymbolBinding(sym);
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
        return this.parentEnv.operatorFor(expr);
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
        this.parentEnv.setSymbolBinding(sym, binding);
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
        return this.parentEnv.valueOf(expr);
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
     * The values from the invocation of the module.
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

export interface StepperConfig {

}

function env_options_from_stepper_options(options?: Partial<StepperConfig>): EnvOptions {
    const config: EnvOptions = {
        dependencies: ['Blade', 'Flt', 'Imu', 'Uom', 'Vector']
    };
    return config;
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
    /**
     * @param module
     * @param options 
     * @param initFunc 
     */
    constructor(readonly module: Cons, options?: Partial<StepperConfig>, initFunc?: (runner: Stepper, globalObject: Thing) => void) {
        this.#currStepper = this;
        this.#stepFunctions = Object.create(null);
        this.#initFunc = initFunc;
        this.#initStepFunctions();
        const coreEnv = create_env(env_options_from_stepper_options(options));
        init_env(coreEnv);
        this.#globalScope = this.createScope(null, new BaseEnv(coreEnv, this.createObjectProto(null)));
        this.#globalThing = this.#globalScope.thing;
        this.#runPolyfills();
        const state = new State(module, this.#globalScope);
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
            if (!state || (is_cons(node) && is_module(node) && state.done)) {
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
                else if (is_nil(node)) {
                    stack.top.value = node;
                }
                else if (is_atom(node)) {
                    stack.pop();
                    const op = stack.top.$.operatorFor(node);
                    if (op) {
                        stack.top.value = op.valueOf(node);
                    }
                    else {
                        stack.top.value = node;
                    }
                }
                else {
                    throw Error(`${node} is not a cons, nil, or atom.`);
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
    #initStepFunctions(): void {
        this.#stepFunctions[native_sym(Native.add).printname] = Eval_add;
        this.#stepFunctions[native_sym(Native.multiply).printname] = Eval_multiply;
        this.#stepFunctions[native_sym(Native.lco).printname] = Eval_v_args;
        this.#stepFunctions[native_sym(Native.rco).printname] = Eval_v_args;
        this.#stepFunctions['='] = Eval_assign;
        this.#stepFunctions[native_sym(Native.testeq).printname] = Eval_relational_expr;
        this.#stepFunctions[native_sym(Native.testne).printname] = Eval_relational_expr;
        this.#stepFunctions[native_sym(Native.testge).printname] = Eval_relational_expr;
        this.#stepFunctions[native_sym(Native.testgt).printname] = Eval_relational_expr;
        this.#stepFunctions[native_sym(Native.testle).printname] = Eval_relational_expr;
        this.#stepFunctions[native_sym(Native.testlt).printname] = Eval_relational_expr;
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
        this.#stepFunctions[native_sym(Native.component).printname] = Eval_3_args;
        this.#stepFunctions['conj'] = Eval_1_args;
        this.#stepFunctions['contract'] = Eval_v_args;
        this.#stepFunctions[native_sym(Native.cos).printname] = Eval_1_args;
        this.#stepFunctions[native_sym(Native.cosh).printname] = Eval_1_args;
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
        this.#stepFunctions[native_sym(Native.inner).printname] = Eval_v_args;
        this.#stepFunctions['integral'] = Eval_2_args;
        this.#stepFunctions['inv'] = Eval_1_args;
        this.#stepFunctions['isprime'] = Eval_1_args;
        this.#stepFunctions[native_sym(Native.pow).printname] = Eval_power;
        this.#stepFunctions['laguerre'] = Eval_v_args;
        this.#stepFunctions['lcm'] = Eval_v_args;
        this.#stepFunctions['leading'] = Eval_2_args;
        this.#stepFunctions['legendre'] = Eval_v_args;
        this.#stepFunctions['log'] = Eval_1_args;
        this.#stepFunctions['not'] = Eval_1_args;
        this.#stepFunctions['numerator'] = Eval_1_args;
        this.#stepFunctions['or'] = Eval_v_args;
        this.#stepFunctions[native_sym(Native.outer).printname] = Eval_v_args;
        this.#stepFunctions['prime'] = Eval_1_args;
        this.#stepFunctions['quotient'] = Eval_n_args;
        this.#stepFunctions['rank'] = Eval_1_args;
        this.#stepFunctions['rationalize'] = Eval_1_args;
        this.#stepFunctions['rect'] = Eval_1_args;
        this.#stepFunctions['roots'] = Eval_n_args;
        this.#stepFunctions['shape'] = Eval_1_args;
        this.#stepFunctions['simplify'] = Eval_1_args;
        this.#stepFunctions[native_sym(Native.sin).printname] = Eval_1_args;
        this.#stepFunctions[native_sym(Native.sinh).printname] = Eval_1_args;
        this.#stepFunctions['sqrt'] = Eval_1_args;
        this.#stepFunctions['subst'] = Eval_n_args;
        this.#stepFunctions['tan'] = Eval_1_args;
        this.#stepFunctions['tanh'] = Eval_1_args;
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
