/* eslint-disable @typescript-eslint/no-unused-vars */
import { CellHost, Rat, Sym, Tensor } from "math-expression-atoms";
import { AtomHandler, ExprContext, LambdaExpr } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { Atom, Cons, is_atom, items_to_cons, U } from "math-expression-tree";
import { AtomListener, ExprEngineListener } from "../api/api";
import { CompareFn, Directive, EvalFunction, ExprComparator, Extension, ExtensionBuilder, ExtensionEnv, KeywordRunner, Predicates, PrintHandler, TFLAG_DIFF, TFLAG_NONE } from "../env/ExtensionEnv";
import { ProgrammingError } from "../programming/ProgrammingError";
import { StackFunction } from "./StackFunction";

export class ExtensionEnvFromExprContext implements ExtensionEnv {
    constructor(readonly ctxt: ExprContext) {
        if (ctxt) {
            // OK
        }
        else {
            throw new ProgrammingError("ctxt MUST be defined.");
        }
    }
    handlerFor<A extends Atom>(atom: A): AtomHandler<A> {
        return this.ctxt.handlerFor(atom);
    }
    addAtomListener(subscriber: AtomListener): void {
        throw new Error("Method not implemented.");
    }
    removeAtomListener(subscriber: AtomListener): void {
        throw new Error("Method not implemented.");
    }
    getCellHost(): CellHost {
        throw new Error("Method not implemented.");
    }
    setCellHost(host: CellHost): void {
        throw new Error("Method not implemented.");
    }
    getProlog(): readonly string[] {
        throw new Error("Method not implemented.");
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
        const expr = items_to_cons(native_sym(Native.add), ...args);
        return this.ctxt.valueOf(expr);
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
    clearBindings(): void {
        throw new Error("Method not implemented.");
    }
    clearOperators(): void {
        throw new Error("Method not implemented.");
    }
    compareFn(opr: Sym): CompareFn {
        return this.ctxt.compareFn(opr);
    }
    component(tensor: Tensor<U>, indices: U): U {
        throw new Error("Method not implemented.");
    }
    defineEvalFunction(opr: Sym, evalFunction: EvalFunction): void {
        throw new Error("Method not implemented.");
    }
    defineFunction(match: U, lambda: LambdaExpr): void {
        throw new Error("Method not implemented.");
    }
    defineStackFunction(opr: Sym, stackFunction: StackFunction): void {
        throw new Error("Method not implemented.");
    }
    defineKeyword(sym: Sym, runner: KeywordRunner): void {
        throw new Error("Method not implemented.");
    }
    defineExtension(builder: ExtensionBuilder<U>): void {
        throw new Error("Method not implemented.");
    }
    defineAssociative(opr: Sym, id: Rat): void {
        throw new Error("Method not implemented.");
    }
    defineUserSymbol(name: Sym): void {
        throw new Error("Method not implemented.");
    }
    derivedEnv(): ExtensionEnv {
        throw new Error("Method not implemented.");
    }
    divide(lhs: U, rhs: U): U {
        throw new Error("Method not implemented.");
    }
    equals(lhs: U, rhs: U): boolean {
        throw new Error("Method not implemented.");
    }
    evaluate(opr: Native, ...args: U[]): U {
        throw new Error("Method not implemented.");
    }
    executeProlog(prolog: readonly string[]): void {
        throw new Error("Method not implemented.");
    }
    exp(expr: U): U {
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
    getDirective(directive: number): number {
        return this.ctxt.getDirective(directive);
    }
    getSymbolPredicates(sym: Sym): Predicates {
        throw new Error("Method not implemented.");
    }
    getSymbolPrintName(sym: Sym): string {
        throw new Error("Method not implemented.");
    }
    getSymbolUsrFunc(sym: Sym): U {
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
        return this.ctxt.getDirective(Directive.expanding) > 0;
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
    iszero(arg: U): boolean {
        if (is_atom(arg)) {
            const handler = this.ctxt.handlerFor(arg);
            return handler.test(arg, native_sym(Native.iszero), this.ctxt);
        }
        throw new Error(`ExtensionEnvFromExprContext.iszero ${arg} method not implemented.`);
        // const expr = items_to_cons(native_sym(Native.iszero), arg);
        // return this.ctxt.valueOf(expr);
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
    extensionFor(expr: U): Extension<U> | undefined {
        throw new Error("Method not implemented.");
    }
    outer(...args: U[]): U {
        throw new Error("Method not implemented.");
    }
    polar(expr: U): U {
        throw new Error("Method not implemented.");
    }
    power(base: U, expo: U): U {
        const expr = items_to_cons(native_sym(Native.pow), base, expo);
        return this.ctxt.valueOf(expr);
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
    pushDirective(directive: number, value: number): void {
        this.ctxt.pushDirective(directive, value);
    }
    popDirective(): void {
        this.ctxt.popDirective();
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
    setSymbolUsrFunc(sym: Sym, usrfunc: U): void {
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
        const value = this.ctxt.valueOf(expr);
        if (value.equals(expr)) {
            return [TFLAG_NONE, value];
        }
        else {
            return [TFLAG_DIFF, value];
        }
    }
    valueOf(expr: U): U {
        return this.ctxt.valueOf(expr);
    }
    hasBinding(opr: Sym, target: Cons): boolean {
        return this.ctxt.hasBinding(opr, target);
    }
    getBinding(opr: Sym, target: Cons): U {
        return this.ctxt.getBinding(opr, target);
    }
    setBinding(opr: Sym, binding: U): void {
        throw new Error("Method not implemented.");
    }
    hasUserFunction(name: Sym): boolean {
        return this.ctxt.hasUserFunction(name);
    }
    getUserFunction(name: Sym): U {
        throw new Error("Method not implemented.");
    }
    setUserFunction(name: Sym, usrfunc: U): void {
        throw new Error("Method not implemented.");
    }
    get listeners(): ExprEngineListener[] {
        throw new Error("Method not implemented.");
    }
}