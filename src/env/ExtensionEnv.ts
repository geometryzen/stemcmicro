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

export enum Directive {
    /**
     * Mutually exclusive with factor.
     */
    expand,
    /**
     * Determines whether numeric types are converted to floating point numbers for numeric evaluation.
     * 
     * The default value as false.
     */
    evaluatingAsFloat,
    /**
     * Determines whether complex numbers are driven towards rectangular or polar notation.
     * 
     * The default value is false.
     */
    evaluatingAsPolar,
    evaluatingAsClock,
    /**
     * Determines whether trigonometric functions are converted to exponential form.
     * 
     * The default is false.
     */
    evaluatingTrigAsExp,
    /**
     * Determines whether zero terms are kept in sums in attempt to preserve the dynamic type.
     * The alternative is to use a canonical zero value, usually that for rational numbers.
     * 
     * The default value is false.
     */
    keepZeroTermsInSums,
    /**
     * Mutually exclusive with expand.
     */
    factor,
    /**
     * Determines whether floating point numbers are rendered as EcmaScript numbers.
     * If not, floating point numbers are rendered in a proprietary format.
     * 
     * The default value is false.
     */
    renderFloatAsEcmaScript,
    /**
     * Determines whether caret token '^' will be used for exponentiation or for the exterior product.
     * Using the caret token for exponetitation is common in mathematical tools but not in programming languages.
     * 
     * The default value is false.
     */
    useCaretForExponentiation
}

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
    setPrintHandler(handler: PrintHandler): void;
    /**
     *
     */
    add(...args: U[]): U;
    arctan(expr: U): U;
    arg(expr: U): U;
    conj(expr: U): U;
    cos(expr: U): U;
    evaluate(opr: Native, ...args: U[]): U;
    exp(expr: U): U;
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
    divide(lhs: U, rhs: U): U;
    /**
     *
     */
    equals(lhs: U, rhs: U): boolean;
    /**
     * @deprecated
     */
    factorize(poly: U, x: U): U;
    getCustomDirective(directive: string): boolean;
    getNativeDirective(directive: Directive): boolean;
    getSymbolProps(sym: Sym | string): SymbolProps;
    /**
     * Used during rendering.
     */
    getSymbolPrintName(sym: Sym): string;
    getSymbolValue(sym: Sym | string): U;
    getSymbolsInfo(): { sym: Sym, value: U }[];
    /**
     * Used to make the environment ready after all operator builders have been added.
     */
    buildOperators(): void;
    imag(expr: U): U;
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
     is_complex(expr: U): boolean;
     /**
     * Corresponds to the 'real' property.
     */
    is_real(expr: U): boolean;
    /**
     * Determines whether expr is scalar-valued.
     */
    isScalar(expr: U): boolean;
    /**
     * A convenience for appling the predicate function to the expression.
     */
    is_zero(expr: U): boolean;
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
    real(expr: U): U;
    remove(varName: Sym): void;
    setCustomDirective(directive: string, value: boolean): void;
    pushNativeDirective(directive: Directive, value: boolean): void;
    popNativeDirective(): void;
    setSymbolOrder(sym: Sym, order: ExprComparator): void;
    setSymbolProps(sym: Sym, overrides: Partial<SymbolProps>): void;
    setSymbolPrintName(sym: Sym, printName: string): void;
    setSymbolValue(sym: Sym, value: U): void;
    sin(expr: U): U;
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
 * Methods don't take a $ parameter because it is hidden state.
 */
export interface Operator<T extends U> {
    readonly key?: string;
    readonly name: string;
    readonly hash?: string;
    readonly phases?: number;
    readonly dependencies?: FEATURE[];
    /**
     * @deprecated We don't want to have predicates hard-coded.
     */
    isImag(expr: T): boolean;
    /**
     * Determines whether this operator can be used to evaluate the expression.
     */
    isKind(expr: U): expr is T;
    /**
     * @deprecated We don't want to have predicates hard-coded.
     */
    isMinusOne(expr: T): boolean;
    /**
     * @deprecated We don't want to have predicates hard-coded.
     */
    isOne(expr: T): boolean;
    /**
     * @deprecated We don't want to have predicates hard-coded.
     */
    isReal(expr: T): boolean;
    /**
     * @deprecated We don't want to have predicates hard-coded.
     */
    isScalar(expr: T): boolean;
    /**
     * @deprecated We don't want to have predicates hard-coded.
     */
    isZero(expr: T): boolean;
    subst(expr: T, oldExpr: U, newExpr: U): U;
    toInfixString(expr: T): string;
    toLatexString(expr: T): string;
    toListString(expr: T): string;
    /**
     * Applies the procedure managed by this extension to the argList.
     * @param argList
     */
    evaluate(opr: T, argList: Cons): [TFLAGS, U];
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
 *
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
    isZero(expr: T, $: ExtensionEnv): boolean;
    subst(expr: T, oldExpr: U, newExpr: U, $: ExtensionEnv): U;
    toInfixString(expr: T, $: ExtensionEnv): string;
    toLatexString(expr: T, $: ExtensionEnv): string;
    toListString(expr: T, $: ExtensionEnv): string;
    evaluate(expr: T, argList: Cons, $: ExtensionEnv): [TFLAGS, U];
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U];
    valueOf(expr: T, $: ExtensionEnv): U;
}
