import { Native } from "../native/Native";
import { Rat } from "../tree/rat/Rat";
import { Sym } from "../tree/sym/Sym";
import { Cons, U } from "../tree/tree";
import { EnvConfig } from "./env";

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

// TODO: Need to be able to handle positive and negative cases (like Vector).
/**
 * @hidden
 */
export type FEATURE = 'Blade' | 'Flt' | 'Imu' | 'Uom' | 'Vector';

export type MODE =
    'evaluatingAsFloat' |
    'evaluatingAsPolar' |
    'evaluatingTrigAsExp' |
    'keepZeroTermsInSums' |
    'renderFloatAsEcmaScript' |
    'useCaretForExponentiation';

export interface PrintHandler {
    print(...items: string[]): void;
}

export type CompareFn = (lhs: U, rhs: U) => Sign;

export interface ExprComparator {
    compare(lhs: U, rhs: U, $: ExtensionEnv): Sign;
}

/**
 * Not to be confused with the LegacyExpr.
 * Here the first argument is the argument list and does not include the operator.
 */
export type LambdaExpr = (argList: Cons, $: ExtensionEnv) => U;

/**
 * Not to be confused with a LambdaExpr.
 * Here the first argument is the expression including the operator.
 */
export type LegacyExpr = (expr: Cons, $: ExtensionEnv) => U;

export type KeywordRunner = ($: ExtensionEnv) => void;

export interface SymbolProps {
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
    commutative: boolean,
    /**
     * A complex number is any number of the form x+i*y where x and y are real.
     * All complex numbers are finite. Includes all real numbers.
     */
    complex: boolean,
    extended_negative: boolean,
    extended_nonnegative: boolean,
    extended_nonpositive: boolean,
    extended_nonzero: boolean,
    extended_positive: boolean,
    /**
     * An element of the real number line extended to include infinity.
     * Default is true.
     */
    extended_real: boolean,
    /**
     * A finite expression.
     * Any expression that is not infinite is considered finite.
     */
    finite: boolean,
    /**
     * An element of the field of Hermitian operators.
     */
    hermitian: boolean,
    imaginary: boolean,
    /**
     * An infinite expression.
     */
    infinite: boolean,
    integer: boolean;
    irrational: boolean;
    negative: boolean,
    noninteger: boolean;
    nonnegative: boolean,
    nonpositive: boolean,
    nonzero: boolean,
    positive: boolean,
    rational: boolean,
    real: boolean,
    /**
     * A complex number that is not algebraic.
     * All transcendental numbers are complex.
     * A transcendental number may or may not be real but can never be rational.
     * Defaults to false.
     */
    transcendental: boolean,
    zero: boolean
}


export interface ExtensionEnv {
    getPrintHandler(): PrintHandler;
    setField(kind: 'R' | undefined): void;
    setPrintHandler(handler: PrintHandler): void;
    treatAsReal(sym: Sym): boolean;
    /**
     *
     */
    add(lhs: U, rhs: U): U;
    evaluate(opr: Native, argList: Cons): U;
    clearBindings(): void;
    clearOperators(): void;
    compareFn(sym: Sym): CompareFn;
    /**
     * Defines the implementation of a function that is used to transform (name ...) expressions.
     */
    defineLegacyTransformer(opr: Sym, transformer: LegacyExpr): void;
    defineFunction(match: U, lambda: LambdaExpr): void;
    defineKeyword(sym: Sym, runner: KeywordRunner): void;
    defineOperator(builder: OperatorBuilder<U>): void;
    defineAssociative(opr: Sym, id: Rat): void;
    /**
     *
     */
    equals(lhs: U, rhs: U): boolean;
    /**
     * @deprecated
     */
    factorize(poly: U, x: U): U;
    getChain(outer: Sym, inner: Sym): LambdaExpr;
    setChain(outer: Sym, inner: Sym, lambda: LambdaExpr): void;
    getMode(): number;
    getModeFlag(mode: MODE): boolean;
    getSymbolProps(sym: Sym | string): SymbolProps;
    /**
     * Used during rendering.
     */
    getSymbolToken(sym: Sym): string;
    getSymbolValue(sym: Sym | string): U;
    getSymbolsInfo(): { sym: Sym, value: U }[];
    /**
     * Used to make the environment ready after all operator builders have been added.
     */
    buildOperators(): void;
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
    isExpanding(): boolean;
    isFactoring(): boolean;
    /**
     * Meaning is imaginary valued. i.e. evaluates to i times a real number.
     */
    is_imag(expr: U): boolean;
    isMinusOne(expr: U): boolean;
    isOne(expr: U): boolean;
    /**
     * Corresponds to the 'real' property.
     */
    is_real(expr: U): boolean;
    /**
     * Determines whether expr is scalar-valued.
     */
    isScalar(expr: U): boolean;
    isVector(expr: U): boolean;
    /**
     * Returns false when atom matches Cons or Sym, otherwise depends on the appropriate extension.
     */
    isZero(expr: U): boolean;
    /**
     *
     */
    multiply(lhs: U, rhs: U): U;
    /**
     *
     */
    negate(expr: U): U;
    /**
     * Returns the operator for interacting with the expression.
     * Operator(s) are reference counted and so the operator MUST be released when no longer needed.
     */
    operatorFor(expr: U): Operator<U>;
    /**
     *
     */
    outer(lhs: U, rhs: U): U;
    /**
     *
     */
    power(base: U, expo: U): U;
    remove(varName: Sym): void;
    setMode(mode: number): void;
    setModeFlag(mode: MODE, value: boolean): void;
    setSymbolOrder(sym: Sym, order: ExprComparator): void;
    setSymbolProps(sym: Sym, overrides: Partial<SymbolProps>): void;
    setSymbolToken(sym: Sym, token: string): void;
    setSymbolValue(sym: Sym, value: U): void;
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
export interface OperatorBuilder<T extends U> {
    create($: ExtensionEnv, config: Readonly<EnvConfig>): Operator<T>;
}

export const MODE_EXPANDING = 1;
export const MODE_FACTORING = 2;

export function decodeMode(mode: number): string {
    switch (mode) {
        case MODE_EXPANDING: return 'expanding';
        case MODE_FACTORING: return 'factoring';
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
 * Use to handle an expression, especially to evaluate it.
 * This is the means of extending the system to include other atoms.
 * Every object in the system is an opaque handle.
 */
export interface Operator<T extends U> {
    readonly key?: string;
    readonly name: string;
    readonly hash?: string;
    readonly phases?: number;
    readonly dependencies?: FEATURE[];
    isImag(expr: T): boolean;
    /**
     * Determines whether this operator can be used to evaluate the expression.
     */
    isKind(expr: U): expr is T;
    isMinusOne(expr: T): boolean;
    isOne(expr: T): boolean;
    isReal(expr: T): boolean;
    isScalar(expr: T): boolean;
    isVector(expr: T): boolean;
    isZero(expr: T): boolean;
    subst(expr: T, oldExpr: U, newExpr: U): U;
    toInfixString(expr: T): string;
    toLatexString(expr: T): string;
    toListString(expr: T): string;
    /**
     * Evaluates the expression and also returns some information about the returned expression.
     */
    transform(expr: T): [TFLAGS, U];
    /**
     * Evaluates the expression.
     */
    valueOf(expr: T): U;
}

/**
 * A legacy (and less favored) alternative to using OperatorBuilder and Operator.
 */
export interface Extension<T extends U> {
    readonly key?: string;
    readonly name: string;
    readonly hash?: string;
    readonly phases?: number;
    readonly dependencies?: FEATURE[];
    isImag(expr: T, $: ExtensionEnv): boolean;
    isKind(expr: U, $: ExtensionEnv): boolean;
    isMinusOne(expr: T, $: ExtensionEnv): boolean;
    isOne(expr: T, $: ExtensionEnv): boolean;
    isReal(expr: T, $: ExtensionEnv): boolean;
    isScalar(expr: T, $: ExtensionEnv): boolean;
    isVector(expr: T, $: ExtensionEnv): boolean;
    isZero(expr: T, $: ExtensionEnv): boolean;
    /**
     * Provides the multiplicative identity of the same shape as the zero argument.
     * This capability need only be supported if the data type has an additive identity (zero).
     * This is used in cases where we wish to preserve the structure when adding zero.
     */
    one(zero: T, $: ExtensionEnv): T;
    subst(expr: T, oldExpr: U, newExpr: U, $: ExtensionEnv): U;
    toInfixString(expr: T, $: ExtensionEnv): string;
    toLatexString(expr: T, $: ExtensionEnv): string;
    toListString(expr: T, $: ExtensionEnv): string;
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U];
    valueOf(expr: T, $: ExtensionEnv): U;
}
