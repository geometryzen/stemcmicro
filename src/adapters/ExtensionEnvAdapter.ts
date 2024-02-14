/* eslint-disable @typescript-eslint/no-unused-vars */
import { CellHost, Rat, Sym, Tensor } from "math-expression-atoms";
import { AtomHandler, ExprContext, LambdaExpr } from "math-expression-context";
import { Native } from "math-expression-native";
import { Atom, Cons, U } from "math-expression-tree";
import { AtomListener, ExprEngineListener } from "../api/api";
import { CompareFn, EvalFunction, ExprComparator, Extension, ExtensionBuilder, ExtensionEnv, KeywordRunner, Operator, OperatorBuilder, Predicates, PrintHandler } from "../env/ExtensionEnv";
import { StackFunction } from "./StackFunction";

export class ExtensionEnvAdapter implements ExtensionEnv {
    constructor(readonly ctxt: ExprContext) {

    }
    handlerFor<A extends Atom>(atom: A): AtomHandler<A> {
        throw new Error("Method not implemented.");
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
    clearBindings(): void {
        throw new Error("Method not implemented.");
    }
    clearOperators(): void {
        throw new Error("Method not implemented.");
    }
    compareFn(opr: Sym): CompareFn {
        throw new Error("Method not implemented.");
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
    defineOperator(builder: OperatorBuilder<U>): void {
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
        throw new Error("Method not implemented.");
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
    extensionFor(expr: U): Extension<U> | undefined {
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
    pushDirective(directive: number, value: number): void {
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
        throw new Error("Method not implemented.");
    }
    valueOf(expr: U): U {
        throw new Error("Method not implemented.");
    }
    hasBinding(opr: Sym, target: Cons): boolean {
        throw new Error("Method not implemented.");
    }
    getBinding(opr: Sym, target: Cons): U {
        throw new Error("Method not implemented.");
    }
    setBinding(opr: Sym, binding: U): void {
        throw new Error("Method not implemented.");
    }
    hasUserFunction(name: Sym): boolean {
        throw new Error("Method not implemented.");
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