import { Rat, Sym, Tensor } from "math-expression-atoms";
import { ExprContext, LambdaExpr } from "math-expression-context";
import { Cons, U } from "math-expression-tree";
import { Native } from "../native/Native";
import { CellHost } from "../operators/atom/Cell";
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
export type FEATURE = 'Blade' | 'Boo' | 'Flt' | 'Imu' | 'Map' | 'Rat' | 'Sym' | 'Tensor' | 'Uom';

export const ALL_FEATURES: FEATURE[] = ['Blade', 'Boo', 'Flt', 'Imu', 'Map', 'Rat', 'Sym', 'Tensor', 'Uom'];

/**
 * Determines how an expression is evaluated.
 */
export enum Directive {
    /**
     * Convert familiar expressions to canonical form. Mutually exclusive with familiarize.
     */
    canonicalize,
    /**
     * Replace sin with cos. Mutually exclusive with convertCosToSim.
     */
    convertSinToCos,
    /**
     * Replace cos with sin. Mutually exclusive with convertSinToCos.
     */
    convertCosToSin,
    /**
     * Convert canonical expressions to familiar form. Mutually exclusive with canonicalize.
     */
    familiarize,
    /**
     * Is not the same as the expand function.
     * Mutually exclusive with factoring.
     */
    expanding,
    /**
     * Determines whether abs(a + b + c ...) is expanded.
     */
    expandAbsSum,
    /**
     * Determines whether cos(a + b + c ...) is expanded.
     */
    expandCosSum,
    /**
    * Determines whether (a + b + c ...) raised to a positive integer exponent is expanded.
    */
    expandPowSum,
    /**
     * Determines whether cos(a + b + c ...) is expanded.
     */
    expandSinSum,
    /**
    * Determines whether numeric types are converted to floating point numbers for numeric evaluation.
    * 
    * The default value as false.
    */
    evaluatingAsFloat,
    /**
     * Determines whether complex numbers are driven towards clock form.
     * The other possibilities are polar and rectanglular.
     * 
     * The default value is false.
     */
    complexAsClock,
    /**
     * Determines whether complex numbers are driven towards polar form.
     * The other possibilities are clock and rectanglular.
     * 
     * The default value is false.
     */
    complexAsPolar,
    /**
     * Determines whether complex numbers are driven towards rectangular form.
     * The other possibilities are clock and polar.
     * 
     * The default value is false.
     */
    complexAsRectangular,
    /**
     * Determines whether exponential functions are converted ti exponential form.
     */
    convertExpToTrig,
    /**
     * Determines whether trigonometric functions are converted to exponential form.
     * 
     * The default is false.
     */
    convertTrigToExp,
    /**
     * Determines whether zero terms are kept in sums in attempt to preserve the dynamic type.
     * The alternative is to use a canonical zero value, usually that for rational numbers.
     * 
     * The default value is false.
     */
    keepZeroTermsInSums,
    /**
     * Is not the same as the factor function.
     * Mutually exclusive with expanding.
     */
    factoring,
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
    useCaretForExponentiation,
    /**
     * Determines whether test funtions will return Boo or Rat values.
     * 
     * The default value is false.
     */
    useIntegersForPredicates,
    useParenForTensors
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
export type ConsExpr = (expr: Cons, $: ExtensionEnv) => U;

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
     * A finite expression.
     * Any expression that is not infinite is considered finite.
     */
    finite: boolean,
    /**
     * An element of the field of Hermitian operators.
     */
    hermitian: boolean,
    /**
     * The extension of the complex numbers to include infinitesimals and infinite numbers.
     */
    hypercomplex: boolean;
    /**
     * The extension of the real numbers to include infinitesimals and infinite numbers.
     */
    hyperreal: boolean;
    imaginary: boolean,
    /**
     * An infinite expression.
     */
    infinite: boolean,
    infinitesimal: boolean,
    integer: boolean;
    irrational: boolean;
    negative: boolean,
    noninteger: boolean;
    nonnegative: boolean,
    nonpositive: boolean,
    nonzero: boolean,
    /**
     * A real number that is greater than zero.
     * All positive numbers are finite so infinity is not positive.
     */
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

/**
 *
 */
export interface ExtensionEnv extends ExprContext {
    getCellHost(): CellHost;
    setCellHost(host: CellHost): void;
    getProlog(): readonly string[];
    getPrintHandler(): PrintHandler;
    setPrintHandler(handler: PrintHandler): void;
    abs(expr: U): U;
    algebra(metric: Tensor<U>, labels: Tensor<U>): Tensor<U>
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
    compareFn(sym: Sym): CompareFn;
    component(tensor: Tensor<U>, indices: U): U;
    /**
     * Defines the implementation of a function that is used to transform (name ...) expressions.
     */
    defineConsTransformer(opr: Sym, consExpr: ConsExpr): void;
    defineFunction(match: U, lambda: LambdaExpr): void;
    /**
     * e.g. clearall 
     */
    defineKeyword(sym: Sym, runner: KeywordRunner): void;
    defineOperator(builder: OperatorBuilder<U>): void;
    defineAssociative(opr: Sym, id: Rat): void;
    defineUserSymbol(sym: Sym): void;
    derivedEnv(): ExtensionEnv;
    divide(lhs: U, rhs: U): U;
    /**
     *
     */
    equals(lhs: U, rhs: U): boolean;
    evaluate(opr: Native, ...args: U[]): U;
    executeProlog(prolog: readonly string[]): void;
    exp(expr: U): U;
    factor(expr: U): U;
    /**
     *
     */
    factorize(poly: U, x: U): U;
    float(expr: U): U;
    getCustomDirective(directive: string): boolean;
    getDirective(directive: Directive): boolean;
    getSymbolPredicates(sym: Sym): Predicates;
    /**
     * Used during rendering.
     */
    getSymbolPrintName(sym: Sym): string;
    getSymbolUsrFunc(sym: Sym): U;
    getSymbolsInfo(): { sym: Sym, value: U }[];
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
    /**
     * @deprecated Use getDirective(Directive.expanding)
     */
    isExpanding(): boolean;
    /**
     * @deprecated Use getDirective(Directive.factoring)
     */
    isFactoring(): boolean;
    /**
     * Meaning is imaginary valued. i.e. evaluates to i times a real number.
     */
    isimag(expr: U): boolean;
    isinfinite(expr: U): boolean;
    isinfinitesimal(expr: U): boolean;
    isminusone(expr: U): boolean;
    isnegative(expr: U): boolean;
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
     * Returns the operator for interacting with the expression.
     * Operator(s) are reference counted and so the operator MUST be released when no longer needed.
     * User-defined atoms may not have an operator.
     */
    operatorFor(expr: U): Operator<U> | undefined;
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
    setCustomDirective(directive: string, value: boolean): void;
    pushDirective(directive: Directive, value: boolean): void;
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
 * Use to evaluate any kind of expression.
 * This is the means of extending the system to include other atoms.
 * Every object in the system is an opaque handle.
 */
export interface Operator<T extends U> {
    readonly name?: string;
    /**
     * Determines which expressions this operator matches.
     */
    readonly hash: string;
    /**
     * Determines whether this operator is for evaluating list expressions.
     */
    iscons(): this is Operator<Cons>;
    /**
     * The symbol that this operator represents.
     * 
     * i.e. (operator arg0 arg1 ...)
     * 
     * If this operator is not for list expressions, the implementation should throw an error.
     */
    operator(): Sym | never;
    /**
     * Determines the modes in which this operator is active.
     */
    readonly phases?: number;
    /**
     *
     */
    readonly dependencies?: FEATURE[];
    /**
     * Determines whether this operator can be used to evaluate the expression.
     */
    isKind(expr: U): expr is T;
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

export interface Extension<T extends U> {
    readonly hash: string;
    readonly name: string;
    readonly phases?: number;
    readonly dependencies?: FEATURE[];
    iscons(): this is Extension<Cons>;
    operator(): Sym;
    isKind(expr: U, $: ExtensionEnv): boolean;
    subst(expr: T, oldExpr: U, newExpr: U, $: ExtensionEnv): U;
    toInfixString(expr: T, $: ExtensionEnv): string;
    toLatexString(expr: T, $: ExtensionEnv): string;
    toListString(expr: T, $: ExtensionEnv): string;
    evaluate(expr: T, argList: Cons, $: ExtensionEnv): [TFLAGS, U];
    transform(expr: T, $: ExtensionEnv): [TFLAGS, U];
    valueOf(expr: T, $: ExtensionEnv): U;
}
