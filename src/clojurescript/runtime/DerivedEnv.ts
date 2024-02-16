/* eslint-disable @typescript-eslint/no-unused-vars */
import { Rat, Sym, Tensor } from "math-expression-atoms";
import { LambdaExpr } from "math-expression-context";
import { Native } from "math-expression-native";
import { Cons, U } from "math-expression-tree";
import { CompareFn, Directive, EvalFunction, ExprComparator, KeywordRunner, Predicates, PrintHandler } from "../../env/ExtensionEnv";
import { Scope, Thing } from "./Stepper";

export class DerivedScope implements Scope {
    constructor(readonly parentEnv: Scope, readonly strict: boolean, readonly thing: Thing) {

    }
    hasBinding(sym: Sym, target: Cons): boolean {
        return this.parentEnv.hasBinding(sym, target);
    }
    hasUserFunction(sym: Sym): boolean {
        return this.parentEnv.hasUserFunction(sym);
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
    defineConsTransformer(opr: Sym, consExpr: EvalFunction): void {
        throw new Error("Method not implemented.");
    }
    defineFunction(match: U, lambda: LambdaExpr): void {
        throw new Error("Method not implemented.");
    }
    defineKeyword(sym: Sym, runner: KeywordRunner): void {
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
    getDirective(directive: Directive): boolean {
        throw new Error("Method not implemented.");
    }
    getSymbolPredicates(sym: Sym): Predicates {
        throw new Error("Method not implemented.");
    }
    getSymbolPrintName(sym: Sym): string {
        throw new Error("Method not implemented.");
    }
    getBinding(sym: Sym, target: Cons): U {
        return this.parentEnv.getBinding(sym, target);
    }
    getUserFunction(sym: Sym): U {
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
    setBinding(sym: Sym, binding: U): void {
        this.parentEnv.setBinding(sym, binding);
    }
    setUserFunction(sym: Sym, usrfunc: U): void {
        this.parentEnv.setUserFunction(sym, usrfunc);
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
}
