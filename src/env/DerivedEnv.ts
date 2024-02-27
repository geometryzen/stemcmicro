/* eslint-disable @typescript-eslint/no-unused-vars */
import { CellHost, create_sym, is_boo, is_flt, is_jsobject, is_keyword, is_map, is_rat, is_str, is_sym, is_tensor, Sym, Tensor } from "math-expression-atoms";
import { ExprHandler, LambdaExpr } from "math-expression-context";
import { Native } from "math-expression-native";
import { Cons, is_atom, is_cons, is_nil, items_to_cons, Shareable, U } from "math-expression-tree";
import { StackFunction } from "../adapters/StackFunction";
import { AtomListener, ExprEngineListener } from "../api/api";
import { assert_sym_any_any } from "../clojurescript/runtime/step_setq";
import { ProgramStack } from "../eigenmath/ProgramStack";
import { setq } from "../operators/assign/assign_any_any";
import { eval_dotdot } from "../operators/dotdot/eval_dotdot";
import { JsObjectExtension } from "../operators/jsobject/JsObjectExtension";
import { eval_let } from "../operators/let/eval_let";
import { ProgrammingError } from "../programming/ProgrammingError";
import { ASSIGN, COMPONENT, LET } from "../runtime/constants";
import { EnvConfig } from "./EnvConfig";
import { CompareFn, EvalFunction, ExprComparator, Extension, ExtensionBuilder, ExtensionEnv, KeywordRunner, Predicates, PrintHandler, TFLAG_DIFF, TFLAG_NONE } from "./ExtensionEnv";
/**
 * Evaluates each item in the `argList` and returns (opr ...), 
 */
function evaluate_args(opr: Sym, argList: Cons, $: ExtensionEnv): Cons {
    // We must evaluate all the operands in this scope before letting the base to the gruntwork of multiplication
    // const values = argList.map(x=>$.valueOf(x));
    // cons(opr, values);
    const args = [...argList].map(x => $.valueOf(x));
    return items_to_cons(opr, ...args);
}

/**
 * The ExtensionEnv was originally implemented for a scripting language with a single global scope.
 * By using this DerivedEnv over the create_env function we can incrementally migrate to an architecture
 * that supports nested scopes.
 */
export class DerivedEnv implements ExtensionEnv {
    readonly #baseEnv: ExtensionEnv;
    readonly #config: Readonly<EnvConfig>;
    readonly #bindings: Map<string, U> = new Map();
    readonly #userfunc: Map<string, U> = new Map();
    readonly listeners: ExprEngineListener[] = [];
    #refCount = 1;
    constructor(baseEnv: ExtensionEnv, config: Readonly<EnvConfig>) {
        this.#baseEnv = baseEnv;
        this.#baseEnv.addRef();
        this.#config = config;
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.#baseEnv.release();
        }
    }
    hasState(key: string): boolean {
        return this.#baseEnv.hasState(key);
    }
    getState(key: string): Shareable {
        return this.#baseEnv.getState(key);
    }
    setState(key: string, value: Shareable): void {
        this.#baseEnv.setState(key, value);
    }
    addAtomListener(subscriber: AtomListener): void {
        this.#baseEnv.addAtomListener(subscriber);
    }
    removeAtomListener(subscriber: AtomListener): void {
        this.#baseEnv.removeAtomListener(subscriber);
    }
    getCellHost(): CellHost {
        return this.#baseEnv.getCellHost();
    }
    setCellHost(host: CellHost): void {
        this.#baseEnv.setCellHost(host);
    }
    getProlog(): readonly string[] {
        throw new Error('getProlog method not implemented.');
    }
    getPrintHandler(): PrintHandler {
        return this.#baseEnv.getPrintHandler();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setPrintHandler(handler: PrintHandler): void {
        this.#baseEnv.setPrintHandler(handler);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    abs(expr: U): U {
        throw new Error('abs method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    algebra(metric: Tensor<U>, labels: Tensor<U>): Tensor<U> {
        throw new Error('algebra method not implemented.');
    }
    add(...args: U[]): U {
        throw new Error('add method not implemented.');
    }
    arccos(expr: U): U {
        throw new Error('arccos method not implemented.');
    }
    arcsin(expr: U): U {
        throw new Error('arcsin method not implemented.');
    }
    arctan(expr: U): U {
        throw new Error('arctan method not implemented.');
    }
    arg(expr: U): U {
        throw new Error('arg method not implemented.');
    }
    buildOperators(): void {
        this.#baseEnv.buildOperators();
    }
    clock(expr: U): U {
        throw new Error('clock method not implemented.');
    }
    conj(expr: U): U {
        throw new Error('conj method not implemented.');
    }
    cos(expr: U): U {
        throw new Error('cos method not implemented.');
    }
    clearBindings(): void {
        this.#bindings.clear();
        this.#baseEnv.clearBindings();
    }
    clearOperators(): void {
        this.#baseEnv.clearOperators();
    }
    compareFn(opr: Sym): CompareFn {
        return this.#baseEnv.compareFn(opr);
    }
    component(tensor: Tensor<U>, indices: U): U {
        throw new Error('component method not implemented.');
    }
    defineEvalFunction(opr: Sym, evalFunction: EvalFunction): void {
        this.#baseEnv.defineEvalFunction(opr, evalFunction);
    }
    defineFunction(match: U, lambda: LambdaExpr): void {
        throw new Error('defineFunction method not implemented.');
    }
    defineStackFunction(opr: Sym, stackFunction: StackFunction): void {
        this.#baseEnv.defineStackFunction(opr, stackFunction);
    }
    defineKeyword(sym: Sym, runner: KeywordRunner): void {
        this.#baseEnv.defineKeyword(sym, runner);
    }
    defineExtension(builder: ExtensionBuilder<U>): void {
        this.#baseEnv.defineExtension(builder);
    }
    defineUserSymbol(name: Sym): void {
        this.#baseEnv.defineUserSymbol(name);
    }
    derivedEnv(): ExtensionEnv {
        return new DerivedEnv(this, this.#config);
    }
    divide(lhs: U, rhs: U): U {
        throw new Error('divide method not implemented.');
    }
    equals(lhs: U, rhs: U): boolean {
        throw new Error('equals method not implemented.');
    }
    evaluate(opr: Native, ...args: U[]): U {
        throw new Error('evaluate method not implemented.');
    }
    executeProlog(prolog: readonly string[]): void {
        throw new Error('executeProlog method not implemented.');
    }
    exp(expr: U): U {
        throw new Error('exp method not implemented.');
    }
    factor(expr: U): U {
        throw new Error('factor method not implemented.');
    }
    factorize(poly: U, x: U): U {
        throw new Error('factorize method not implemented.');
    }
    float(expr: U): U {
        throw new Error('float method not implemented.');
    }
    getDirective(directive: number): number {
        return this.#baseEnv.getDirective(directive);
    }
    getSymbolPredicates(sym: Sym): Predicates {
        throw new Error('getSymbolPredicates method not implemented.');
    }
    getSymbolPrintName(sym: Sym): string {
        return this.#baseEnv.getSymbolPrintName(sym);
    }
    getSymbolUsrFunc(sym: Sym): U {
        throw new Error('getSymbolYsrFunc method not implemented.');
    }
    getSymbolsInfo(): { sym: Sym; value: U; }[] {
        // TODO: Symbols in the bindings?
        return this.#baseEnv.getSymbolsInfo();
    }
    handlerFor<T extends U>(expr: T): ExprHandler<T> {
        return this.#baseEnv.handlerFor(expr);
    }
    im(expr: U): U {
        throw new Error('im method not implemented.');
    }
    inner(lhs: U, rhs: U): U {
        throw new Error('inner method not implemented.');
    }
    is(predicate: Sym, expr: U): boolean {
        throw new Error('is method not implemented.');
    }
    iscomplex(expr: U): boolean {
        throw new Error('iscomplex method not implemented.');
    }
    isExpanding(): boolean {
        throw new Error('isExpanding method not implemented.');
    }
    isFactoring(): boolean {
        throw new Error('isFactorin method not implemented.');
    }
    isimag(expr: U): boolean {
        throw new Error('isimag method not implemented.');
    }
    isinfinite(expr: U): boolean {
        throw new Error('isinfinite method not implemented.');
    }
    isinfinitesimal(expr: U): boolean {
        throw new Error('isinfinitesimal method not implemented.');
    }
    isminusone(expr: U): boolean {
        throw new Error('isminusone method not implemented.');
    }
    isnegative(expr: U): boolean {
        throw new Error('isnegative method not implemented.');
    }
    isone(expr: U): boolean {
        if (is_nil(expr)) {
            return false;
        }
        throw new Error(`isone ${expr} method not implemented.`);
    }
    ispositive(expr: U): boolean {
        throw new Error('ispositive method not implemented.');
    }
    isreal(expr: U): boolean {
        throw new Error('isreal method not implemented.');
    }
    isscalar(expr: U): boolean {
        throw new Error('iscalar method not implemented.');
    }
    iszero(expr: U): boolean {
        // console.lg("DerivedEnv.iszero", `${expr}`);
        if (is_flt(expr)) {
            return expr.isZero();
        }
        else if (is_nil(expr)) {
            return false;
        }
        throw new Error(`iszero ${expr} method not implemented.`);
    }
    log(expr: U): U {
        throw new Error('log method not implemented.');
    }
    multiply(...args: U[]): U {
        throw new Error('multiply method not implemented.');
    }
    negate(expr: U): U {
        throw new Error('negate method not implemented.');
    }
    extensionFor(expr: U): Extension<U> | undefined {
        throw new Error('extensionFor method not implemented.');
    }
    outer(...args: U[]): U {
        throw new Error('outer method not implemented.');
    }
    polar(expr: U): U {
        throw new Error('polar method not implemented.');
    }
    power(base: U, expo: U): U {
        throw new Error('power method not implemented.');
    }
    re(expr: U): U {
        throw new Error('re method not implemented.');
    }
    rect(expr: U): U {
        throw new Error('rect method not implemented.');
    }
    remove(varName: Sym): void {
        throw new Error('remove method not implemented.');
    }
    pushDirective(directive: number, value: number): void {
        this.#baseEnv.pushDirective(directive, value);
    }
    popDirective(): void {
        this.#baseEnv.popDirective();
    }
    setSymbolOrder(sym: Sym, order: ExprComparator): void {
        this.#baseEnv.setSymbolOrder(sym, order);
    }
    setSymbolPredicates(sym: Sym, predicates: Partial<Predicates>): void {
        throw new Error('setSymbolPredicates method not implemented.');
    }
    setSymbolPrintName(sym: Sym, printName: string): void {
        throw new Error('setSymbolPrintName method not implemented.');
    }
    setSymbolUsrFunc(sym: Sym, usrfunc: U): void {
        this.#userfunc.set(sym.key(), usrfunc);
    }
    simplify(expr: U): U {
        throw new Error('simplify method not implemented.');
    }
    sin(expr: U): U {
        throw new Error('sin method not implemented.');
    }
    sqrt(expr: U): U {
        throw new Error('sqrt method not implemented.');
    }
    st(expr: U): U {
        throw new Error('st method not implemented.');
    }
    subst(newExpr: U, oldExpr: U, expr: U): U {
        throw new Error('subst method not implemented.');
    }
    subtract(lhs: U, rhs: U): U {
        throw new Error('subtract method not implemented.');
    }
    toInfixString(expr: U): string {
        return this.#baseEnv.toInfixString(expr);
    }
    toLatexString(expr: U): string {
        return this.#baseEnv.toLatexString(expr);
    }
    toSExprString(expr: U): string {
        return this.#baseEnv.toSExprString(expr);
    }
    transform(expr: U): [number, U] {
        const value = this.valueOf(expr);
        try {
            if (value.equals(expr)) {
                expr.addRef();
                return [TFLAG_NONE, expr];
            }
            else {
                value.addRef();
                return [TFLAG_DIFF, value];
            }
        }
        finally {
            value.release();
        }
    }
    valueOf(expr: U, stack?: Pick<ProgramStack, 'push'>): U {
        // console.lg("DerivedEnv.valueOf");
        if (stack) {
            throw new ProgrammingError("TODO: DerivedEnv.valueOf");
        }
        if (is_cons(expr)) {
            const opr = expr.opr;
            try {
                const DOTDOT = create_sym("..");
                if (is_sym(opr)) {
                    if (opr.equals(ASSIGN)) {
                        return setq(expr.lhs, expr.rhs, assert_sym_any_any(expr), this);
                    }
                    else if (opr.equals(COMPONENT)) {
                        return this.#baseEnv.valueOf(expr);
                    }
                    else if (opr.equals(DOTDOT)) {
                        return eval_dotdot(expr, this);
                    }
                    else if (opr.equals(LET)) {
                        return eval_let(expr, this);
                    }
                    else {
                        return this.#baseEnv.valueOf(evaluate_args(opr, expr.argList, this));
                    }
                }
            }
            finally {
                opr.release();
            }
        }
        else if (is_atom(expr)) {
            if (is_boo(expr)) {
                return expr;
            }
            else if (is_flt(expr)) {
                return expr;
            }
            else if (is_jsobject(expr)) {
                // This is the idea until we can do a lookup of the extension.
                const extension = new JsObjectExtension(this.#config);
                return extension.valueOf(expr, this);
            }
            else if (is_keyword(expr)) {
                return expr;
            }
            else if (is_map(expr)) {
                return this.#baseEnv.valueOf(expr);
            }
            else if (is_rat(expr)) {
                return expr;
            }
            else if (is_str(expr)) {
                return expr;
            }
            else if (is_sym(expr)) {
                const key = expr.key();
                if (this.#bindings.has(key)) {
                    return this.#bindings.get(key)!;
                }
                else {
                    return this.#baseEnv.valueOf(expr);
                }
            }
            else if (is_tensor(expr)) {
                // We really need to be able to ask for the Extension because that abstraction
                // does not bind early to the ExtensionEnv.
                // const handler = this.#baseEnv.extensionFor(expr)!;
                // handler..valueOf(expr)
                // 
                return this.#baseEnv.valueOf(expr);
            }
            else {
                // In the general case we look for the Extension to correctly evaluate the atom in the current scope.
                const extension = this.#baseEnv.extensionFor(expr);
                if (extension) {
                    return extension.valueOf(expr, this);
                }
                else {
                    // This we be OK provided that the atom has no internal structure e.g. Map, Tensor
                    return expr;
                }
            }
        }
        throw new Error(`DerivedEnv.valueOf ${expr} method not implemented.`);
    }
    getBinding(opr: Sym, target: Cons): U {
        // console.lg("DerivedEnv.getBinding", `${opr}`, `${target}`);
        const key = opr.key();
        if (this.#bindings.has(key)) {
            return this.#bindings.get(key)!;
        }
        else {
            return this.#baseEnv.getBinding(opr, target);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUserFunction(sym: Sym): U {
        throw new Error('getUserFunction method not implemented.');
    }
    hasBinding(opr: Sym, target: Cons): boolean {
        return this.#baseEnv.hasBinding(opr, target);
    }
    hasUserFunction(sym: Sym): boolean {
        if (this.#userfunc.has(sym.key())) {
            return true;
        }
        else {
            return this.#baseEnv.hasUserFunction(sym);
        }
    }
    setBinding(opr: Sym, binding: U): void {
        // console.lg("DerivedEnv.setBinding", `${sym}`, `${binding}`);
        this.#bindings.set(opr.key(), binding);
    }
    setUserFunction(sym: Sym, usrfunc: U): void {
        this.#userfunc.set(sym.key(), usrfunc);
    }
}
