/* eslint-disable @typescript-eslint/no-unused-vars */
import { CellHost, create_int, is_boo, Rat, Sym, Tensor } from "math-expression-atoms";
import { AtomHandler, ExprContext, LambdaExpr } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { Atom, Cons, items_to_cons, U } from "math-expression-tree";
import { AtomListener, ExprEngineListener } from "../api/api";
import { CompareFn, Directive, EvalFunction, ExprComparator, Extension, ExtensionBuilder, ExtensionEnv, KeywordRunner, Predicates, PrintHandler, TFLAG_DIFF, TFLAG_NONE } from "../env/ExtensionEnv";
import { is_rat } from "../operators/rat/rat_extension";
import { ProgrammingError } from "../programming/ProgrammingError";
import { StackFunction } from "./StackFunction";

function predicate_to_boolean(expr: U): boolean {
    if (is_boo(expr)) {
        return expr.isTrue();
    }
    else if (is_rat(expr)) {
        if (expr.isOne()) {
            return true;
        }
        else if (expr.isZero()) {
            return false;
        }
        else {
            throw new ProgrammingError(`${expr}`);
        }
    }
    else {
        throw new ProgrammingError(`${expr}`);
    }
}

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
    abs(arg: U): U {
        const expr = items_to_cons(native_sym(Native.arg), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    algebra(metric: Tensor<U>, labels: Tensor<U>): Tensor<U> {
        throw new Error("Method not implemented.");
    }
    add(...args: U[]): U {
        const expr = items_to_cons(native_sym(Native.add), ...args);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    arccos(arg: U): U {
        const expr = items_to_cons(native_sym(Native.arccos), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    arcsin(arg: U): U {
        const expr = items_to_cons(native_sym(Native.arcsin), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    arctan(arg: U): U {
        const expr = items_to_cons(native_sym(Native.arctan), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    arg(arg: U): U {
        const expr = items_to_cons(native_sym(Native.arg), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    clock(arg: U): U {
        const expr = items_to_cons(native_sym(Native.clock), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    conj(arg: U): U {
        const expr = items_to_cons(native_sym(Native.conj), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    cos(arg: U): U {
        const expr = items_to_cons(native_sym(Native.cos), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
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
        const expr = items_to_cons(native_sym(Native.component), tensor, indices);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
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
        const expr = items_to_cons(native_sym(Native.divide), lhs, rhs);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    equals(lhs: U, rhs: U): boolean {
        const expr = items_to_cons(native_sym(Native.testeq), lhs, rhs);
        try {
            const retval = this.ctxt.valueOf(expr);
            try {
                return predicate_to_boolean(retval);
            }
            finally {
                retval.release();
            }

        }
        finally {
            expr.release();
        }
    }
    evaluate(opr: Native, ...args: U[]): U {
        throw new Error("Method not implemented.");
    }
    executeProlog(prolog: readonly string[]): void {
        throw new Error("Method not implemented.");
    }
    exp(arg: U): U {
        const expr = items_to_cons(native_sym(Native.exp), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    factor(arg: U): U {
        const expr = items_to_cons(native_sym(Native.factor), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    factorize(poly: U, x: U): U {
        throw new Error("Method not implemented.");
    }
    float(arg: U): U {
        const expr = items_to_cons(native_sym(Native.float), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    getDirective(directive: number): number {
        return this.ctxt.getDirective(directive);
    }
    getSymbolPredicates(sym: Sym): Predicates {
        const predicates: Predicates = {
            algebraic: false,
            antihermitian: false,
            commutative: false,
            complex: false,
            extended_negative: false,
            extended_nonnegative: false,
            extended_nonpositive: false,
            extended_nonzero: false,
            extended_positive: false,
            finite: false,
            hermitian: false,
            hypercomplex: false,
            hyperreal: false,
            imaginary: false,
            infinite: false,
            infinitesimal: false,
            integer: false,
            irrational: false,
            negative: false,
            noninteger: false,
            nonnegative: false,
            nonpositive: false,
            nonzero: false,
            positive: false,
            rational: false,
            real: false,
            transcendental: false,
            zero: false
        };
        return predicates;
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
    im(arg: U): U {
        const expr = items_to_cons(native_sym(Native.imag), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    inner(lhs: U, rhs: U): U {
        const expr = items_to_cons(native_sym(Native.inner), lhs, rhs);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    is(predicate: Sym, expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    iscomplex(arg: U): boolean {
        const expr = items_to_cons(native_sym(Native.iscomplex), arg);
        try {
            const retval = this.ctxt.valueOf(expr);
            try {
                return predicate_to_boolean(retval);
            }
            finally {
                retval.release();
            }
        }
        finally {
            expr.release();
        }
    }
    isExpanding(): boolean {
        return this.ctxt.getDirective(Directive.expanding) > 0;
    }
    isFactoring(): boolean {
        throw new Error("Method not implemented.");
    }
    isimag(arg: U): boolean {
        const expr = items_to_cons(native_sym(Native.isimag), arg);
        try {
            const retval = this.ctxt.valueOf(expr);
            try {
                return predicate_to_boolean(retval);
            }
            finally {
                retval.release();
            }
        }
        finally {
            expr.release();
        }
    }
    isinfinite(arg: U): boolean {
        const expr = items_to_cons(native_sym(Native.isinfinite), arg);
        try {
            const retval = this.ctxt.valueOf(expr);
            try {
                return predicate_to_boolean(retval);
            }
            finally {
                retval.release();
            }
        }
        finally {
            expr.release();
        }
    }
    isinfinitesimal(arg: U): boolean {
        const expr = items_to_cons(native_sym(Native.isinfinitesimal), arg);
        try {
            const retval = this.ctxt.valueOf(expr);
            try {
                return predicate_to_boolean(retval);
            }
            finally {
                retval.release();
            }
        }
        finally {
            expr.release();
        }
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
    isreal(arg: U): boolean {
        const expr = items_to_cons(native_sym(Native.isreal), arg);
        try {
            const retval = this.ctxt.valueOf(expr);
            try {
                return predicate_to_boolean(retval);
            }
            finally {
                retval.release();
            }
        }
        finally {
            expr.release();
        }
    }
    isscalar(expr: U): boolean {
        throw new Error("Method not implemented.");
    }
    iszero(arg: U): boolean {
        const expr = items_to_cons(native_sym(Native.iszero), arg);
        try {
            const retval = this.ctxt.valueOf(expr);
            try {
                return predicate_to_boolean(retval);
            }
            finally {
                retval.release();
            }
        }
        finally {
            expr.release();
        }
    }
    log(arg: U): U {
        const expr = items_to_cons(native_sym(Native.log), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    multiply(...args: U[]): U {
        const expr = items_to_cons(native_sym(Native.multiply), ...args);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    negate(arg: U): U {
        const expr = items_to_cons(native_sym(Native.multiply), create_int(-1), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    extensionFor(expr: U): Extension<U> | undefined {
        throw new Error("Method not implemented.");
    }
    outer(...args: U[]): U {
        const expr = items_to_cons(native_sym(Native.outer), ...args);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    polar(arg: U): U {
        const expr = items_to_cons(native_sym(Native.polar), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    power(base: U, expo: U): U {
        const expr = items_to_cons(native_sym(Native.pow), base, expo);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    re(arg: U): U {
        const expr = items_to_cons(native_sym(Native.real), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    rect(arg: U): U {
        const expr = items_to_cons(native_sym(Native.rect), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    remove(varName: Sym): void {
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
    simplify(arg: U): U {
        const expr = items_to_cons(native_sym(Native.simplify), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    sin(arg: U): U {
        const expr = items_to_cons(native_sym(Native.sin), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    sqrt(arg: U): U {
        const expr = items_to_cons(native_sym(Native.sqrt), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    st(arg: U): U {
        const expr = items_to_cons(native_sym(Native.st), arg);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
    }
    subst(newExpr: U, oldExpr: U, expr: U): U {
        throw new Error("Method not implemented.");
    }
    subtract(lhs: U, rhs: U): U {
        const expr = items_to_cons(native_sym(Native.subtract), lhs, rhs);
        try {
            return this.ctxt.valueOf(expr);
        }
        finally {
            expr.release();
        }
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