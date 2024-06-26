import { Cell, CellHost, Sym, Tensor } from "@stemcmicro/atoms";
import { ExprContext, ExprHandler, LambdaExpr } from "@stemcmicro/context";
import { Native } from "@stemcmicro/native";
import { ProgramIO, StackFunction } from "@stemcmicro/stack";
import { Cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "./EnvConfig";

export type Sign = -1 | 0 | 1;
export const SIGN_LT = -1;
export const SIGN_EQ = 0;
export const SIGN_GT = 1;

export type TFLAGS = number;
/**
 * The expression was ignored by the transformer, usually because it did not match the transformer.
 */
export const TFLAG_NONE = 0;
/**
 * The expression changed as a result of the transformation.
 */
export const TFLAG_DIFF = 1 << 0;
/**
 * The expression did not change as a result of the transformation because it is stable.
 */
export const TFLAG_HALT = 1 << 1;
/**
 * The expression node should be preserved.
 */
export const TFLAG_KEEP = 1 << 2;

/**
 * Returns true if flags has the "diff" bit set.
 */
export function diffFlag(flags: TFLAGS): boolean {
    return (flags & TFLAG_DIFF) === TFLAG_DIFF;
}

/**
 * Returns true if flags has the "halt" bit set.
 */
export function haltFlag(flags: TFLAGS): boolean {
    return (flags & TFLAG_HALT) === TFLAG_HALT;
}

/**
 * Returns true if flags has the "keep" bit set.
 */
export function keepFlag(flags: TFLAGS): boolean {
    return (flags & TFLAG_KEEP) === TFLAG_KEEP;
}

/**
 * Corresponds to the 'name' property on an Atom.
 */
export type FEATURE = "Blade" | "Boo" | "Cell" | "Flt" | "Imu" | "Map" | "Rat" | "Sym" | "Tensor" | "Uom";

export const ALL_FEATURES: FEATURE[] = ["Blade", "Boo", "Cell", "Flt", "Imu", "Map", "Rat", "Sym", "Tensor", "Uom"];

export function flag_from_directive(value: number): boolean {
    return value > 0;
}

export function directive_from_flag(value: boolean | undefined): number {
    if (typeof value === "boolean") {
        return value ? 1 : 0;
    } else {
        return 0;
    }
}

/**
 *
 */
export interface PrintHandler {
    print(...items: string[]): void;
}

export type CompareFn = (lhs: U, rhs: U) => Sign;

/**
 *
 */
export interface ExprComparator {
    compare(lhs: U, rhs: U, $: ExtensionEnv): Sign;
}

/**
 * Not to be confused with a LambdaExpr.
 * Here the first argument is the expression including the operator.
 */
export type EvalFunction = (expr: Cons, $: ExtensionEnv) => U;

export type KeywordRunner = ($: ExtensionEnv) => void;

export interface Predicates {
    /**
     * An algebraic number is any number that is a root of a non-zero polynomial having rational coefficients.
     * All algebraic numbers are complex.
     * An algebraic number may or may not be real.
     * Includes all rational numbers.
     */
    algebraic: boolean;
    /**
     * An element of the field of antihermitian operators.
     * Defaults to false.
     */
    antihermitian: boolean;
    /**
     * A commutative expression.
     * A commutative expression commutes with all other expressions under multiplication.
     * If an expression a has commutative then a * b == b * a for any other expression b (even if b is not commutative).
     * Unlike all other assumptions predicates commutative must always be true or false and can never be undefined.
     * Also unlike all other predicates commutative defaults to true.
     */
    commutative: boolean;
    /**
     * A complex number is any number of the form x+i*y where x and y are real.
     * All complex numbers are finite. Includes all real numbers.
     */
    complex: boolean;
    extended_negative: boolean;
    extended_nonnegative: boolean;
    extended_nonpositive: boolean;
    extended_nonzero: boolean;
    extended_positive: boolean;
    /**
     * A finite expression.
     * Any expression that is not infinite is considered finite.
     */
    finite: boolean;
    /**
     * An element of the field of Hermitian operators.
     */
    hermitian: boolean;
    /**
     * The extension of the complex numbers to include infinitesimals and infinite numbers.
     */
    hypercomplex: boolean;
    /**
     * The extension of the real numbers to include infinitesimals and infinite numbers.
     */
    hyperreal: boolean;
    imaginary: boolean;
    /**
     * An infinite expression.
     */
    infinite: boolean;
    infinitesimal: boolean;
    integer: boolean;
    irrational: boolean;
    negative: boolean;
    noninteger: boolean;
    nonnegative: boolean;
    nonpositive: boolean;
    nonzero: boolean;
    /**
     * A real number that is greater than zero.
     * All positive numbers are finite so infinity is not positive.
     */
    positive: boolean;
    rational: boolean;
    real: boolean;
    /**
     * A complex number that is not algebraic.
     * All transcendental numbers are complex.
     * A transcendental number may or may not be real but can never be rational.
     * Defaults to false.
     */
    transcendental: boolean;
    zero: boolean;
}

export interface CellListener {
    reset(from: U, to: U, source: Cell): void;
}

/**
 *
 */
export interface ExtensionEnv extends ExprContext, Pick<ProgramIO, "listeners"> {
    addCellListener(subscriber: CellListener): void;
    removeCellListener(subscriber: CellListener): void;
    getCellHost(): CellHost;
    setCellHost(host: CellHost): void;
    getProlog(): readonly string[];
    getPrintHandler(): PrintHandler;
    setPrintHandler(handler: PrintHandler): void;
    abs(expr: U): U;
    algebra(metric: Tensor<U>, labels: Tensor<U>): Tensor<U>;
    /**
     *
     */
    add(...args: U[]): U;
    arccos(expr: U): U;
    arcsin(expr: U): U;
    arctan(expr: U): U;
    arg(expr: U): U;
    clock(expr: U): U;
    conj(expr: U): U;
    cos(expr: U): U;
    clearBindings(): void;
    clearOperators(): void;
    compareFn(opr: Sym): CompareFn;
    component(tensor: Tensor<U>, indices: U): U;
    /**
     * Defines the implementation of a function that is used to transform (name ...) expressions.
     */
    defineEvalFunction(opr: Sym, evalFunction: EvalFunction): void;
    defineFunction(match: U, lambda: LambdaExpr): void;
    defineStackFunction(opr: Sym, stackFunction: StackFunction): void;
    defineExtension(builder: ExtensionBuilder<U>, immediate?: boolean): void;
    defineUserSymbol(name: Sym): void;
    derivedEnv(): ExtensionEnv;
    divide(lhs: U, rhs: U): U;
    /**
     *
     */
    equals(lhs: U, rhs: U): boolean;
    evaluate(opr: Native, ...args: U[]): U;
    exp(expr: U): U;
    factor(expr: U): U;
    /**
     *
     */
    factorize(poly: U, x: U): U;
    float(expr: U): U;
    getDirective(directive: number): number;
    getSymbolPredicates(sym: Sym): Predicates;
    /**
     * Used during rendering.
     */
    getSymbolPrintName(sym: Sym): string;
    getSymbolUsrFunc(sym: Sym): U;
    getSymbolsInfo(): { sym: Sym; value: U }[];
    /**
     * Used to make the environment ready after all operator builders have been added.
     */
    buildOperators(): void;
    im(expr: U): U;
    /**
     *
     */
    inner(lhs: U, rhs: U): U;
    /**
     * Generalized predicate testing.
     * @param predicate
     * @param expr
     */
    is(predicate: Sym, expr: U): boolean;
    iscomplex(expr: U): boolean;
    isExpanding(): boolean;
    isFactoring(): boolean;
    /**
     * Meaning is imaginary valued. i.e. evaluates to i times a real number.
     */
    isimag(expr: U): boolean;
    isinfinite(expr: U): boolean;
    isinfinitesimal(expr: U): boolean;
    isminusone(expr: U): boolean;
    isnegative(expr: U): boolean;
    /**
     * @deprecated The implementation doesn't need a full context.
     */
    isone(expr: U): boolean;
    ispositive(expr: U): boolean;
    isreal(expr: U): boolean;
    /**
     * Determines whether expr is scalar-valued.
     */
    isscalar(expr: U): boolean;
    /**
     * A convenience for appling the predicate function to the expression.
     */
    iszero(expr: U): boolean;
    /**
     *
     */
    log(expr: U): U;
    /**
     *
     */
    multiply(...args: U[]): U;
    /**
     *
     */
    negate(expr: U): U;
    extensionFor(expr: U): Extension<U> | undefined;
    /**
     *
     */
    outer(...args: U[]): U;
    polar(expr: U): U;
    /**
     *
     */
    power(base: U, expo: U): U;
    re(expr: U): U;
    rect(expr: U): U;
    remove(varName: Sym): void;
    pushDirective(directive: number, value: number): void;
    popDirective(): void;
    setSymbolOrder(sym: Sym, order: ExprComparator): void;
    setSymbolPredicates(sym: Sym, predicates: Partial<Predicates>): void;
    setSymbolPrintName(sym: Sym, printName: string): void;
    setSymbolUsrFunc(sym: Sym, usrfunc: U): void;
    simplify(expr: U): U;
    sin(expr: U): U;
    sqrt(expr: U): U;
    st(expr: U): U;
    subst(newExpr: U, oldExpr: U, expr: U): U;
    /**
     *
     */
    subtract(lhs: U, rhs: U): U;
    toInfixString(expr: U): string;
    toLatexString(expr: U): string;
    toSExprString(expr: U): string;
    transform(expr: U): [TFLAGS, U];
    valueOf(expr: U): U;
}

/**
 * The interface that MUST be implemented by extensions to the environment.
 * The type parameter,T, allows you to constrain the argument types of the
 * methods that you implement. e.g. If isKind() only matches a Cons, then set T
 * to be Cons. If isKind() only matches Sym, set T to be Sym. In more general
 * cases, use a more general type. The rule is that isKind determines which expression are matched,
 * and when the other method are called (they all contain at least one argument that matches T),
 * it determines the possible dynamic types for T.
 */
export interface ExtensionBuilder<T extends U> {
    create(config: Readonly<EnvConfig>): Extension<T>;
}

export const MODE_EXPANDING = 1;
export const MODE_FACTORING = 2;

export function decodeMode(mode: number): string {
    switch (mode) {
        case MODE_EXPANDING:
            return "expanding";
        case MODE_FACTORING:
            return "factoring";
        default: {
            return `${mode}`;
        }
    }
}

export const MODE_SEQUENCE = [MODE_EXPANDING, MODE_FACTORING];

export const MODE_FLAGS_NONE = 0;
export const MODE_FLAGS_ALL = MODE_EXPANDING | MODE_FACTORING;
export const PHASE_FLAGS_EXPANDING_UNION_FACTORING = MODE_EXPANDING | MODE_FACTORING;

/**
 *
 */
export interface Extension<T extends U> extends ExprHandler<T> {
    readonly hash: string;
    readonly name: string;
    readonly phases?: number;
    readonly dependencies?: FEATURE[];
    iscons(): this is Extension<Cons>;
    operator(): Sym;
    isKind(expr: U, env: ExprContext): boolean;
    toHumanString(expr: T, env: ExprContext): string;
    toInfixString(expr: T, env: ExprContext): string;
    toLatexString(expr: T, env: ExprContext): string;
    toListString(expr: T, env: ExprContext): string;
    /**
     * This method assumes that the opr is in the operator slot of a combination.
     * Except for Sym, that's an experimental proposition.
     */
    evaluate(opr: T, argList: Cons, $: ExprContext): [TFLAGS, U];
    transform(expr: T, $: ExprContext): [TFLAGS, U];
    valueOf(expr: T, $: ExprContext): U;
}

interface ExtensionConstructor<T extends U> {
    new (config: Readonly<EnvConfig>): Extension<T>;
}

class Builder<T extends U> implements ExtensionBuilder<T> {
    constructor(readonly extension: ExtensionConstructor<T>) {}
    create(config: Readonly<EnvConfig>): Extension<T> {
        return new this.extension(config);
    }
}

export function mkbuilder<T extends U>(extension: ExtensionConstructor<T>): ExtensionBuilder<T> {
    return new Builder<T>(extension);
}
