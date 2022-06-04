import { Rat } from "../tree/rat/Rat";
import { Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";

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

export function diffFlag(flags: TFLAGS): boolean {
    // return flags;
    return (flags & TFLAG_DIFF) === TFLAG_DIFF;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function haltFlag(flags: TFLAGS): boolean {
    // return false;
    return (flags & TFLAG_HALT) === TFLAG_HALT;
}

// TODO: Need to be able to handle positive and negative cases (like Vector).
/**
 * @hidden
 */
export type FEATURE = 'Blade' | 'Flt' | 'Imu' | 'Uom' | 'Vector' | '~Vector';

export interface ExtensionEnv {
    setField(kind: 'R' | undefined): void;
    treatAsReal(sym: Sym): boolean;
    treatAsScalar(sym: Sym): boolean;
    treatAsVector(sym: Sym): boolean;
    /**
     * Making associativity explicit in the tree structure.
     */
    readonly explicateMode: boolean;
    /**
     * Making associativity implicit in the tree structure.
     */
    readonly implicateMode: boolean;
    readonly useCaretForExponentiation: boolean;
    readonly version: number;
    add(lhs: U, rhs: U): U;
    /**
     *
     */
    arg(expr: U): U;
    beginSpecial(): void;
    clearBindings(): void;
    clearRenamed(): void;
    compare(lhs: U, rhs: U): Sign;
    cos(expr: U): U;
    defineOperator(builder: OperatorBuilder<U>): void;
    defineAssociative(opr: Sym, id: Rat): void;
    defineKey(sym: Sym): Sym;
    derivative(expr: U, wrt: U): U;
    divide(lhs: U, rhs: U): U;
    endSpecial(): void;
    equals(lhs: U, rhs: U): boolean;
    factorize(poly: U, x: U): U;
    getBinding(sym: Sym): U;
    getBindings(): { sym: Sym, binding: U | undefined }[];
    getPhase(): number;
    /**
     * Used to make the environment ready after all operator builders have been added.
     */
    initialize(): void;
    inner(lhs: U, rhs: U): U;
    inverse(expr: U): U;
    isAssocL(opr: Sym): boolean;
    isAssocR(opr: Sym): boolean;
    isExpanding(): boolean;
    isFactoring(): boolean;
    /**
     * Meaning is imaginary valued. i.e. evaluates to i times a real number.
     */
    isImag(expr: U): boolean;
    isMinusOne(expr: U): boolean;
    isOne(expr: U): boolean;
    isReal(expr: U): boolean;
    /**
     * Determines whether expr is scalar-valued.
     */
    isScalar(expr: U): boolean;
    isVector(expr: U): boolean;
    /**
     * Returns false when atom matches Cons or Sym, otherwise depends on the appropriate extension.
     */
    isZero(expr: U): boolean;
    multiply(lhs: U, rhs: U): U;
    negate(expr: U): U;
    /**
     * Returns the operator for interacting with the expression.
     * Operator(s) are reference counted and so the operator MUST be released when no longer needed.
     */
    operatorFor(expr: U): Operator<U>;
    outer(lhs: U, rhs: U): U;
    power(base: U, expo: U): U;
    remove(varName: Sym): void;
    reset(): void;
    resetSymTab(): void;
    setAssocL(opr: Sym, value: boolean): void;
    setAssocR(opr: Sym, value: boolean): void;
    setBinding(sym: Sym, binding: U): void;
    setFocus(focus: number): void;
    subtract(lhs: U, rhs: U): U;
    toInfixString(expr: U): string;
    toListString(expr: U): string;
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
    create($: ExtensionEnv): Operator<T>;
}

export const FOCUS_EXPLICATE = 1;
export const FOCUS_EXPANDING = 2;
export const FOCUS_FACTORING = 4;
export const FOCUS_IMPLICATE = 8;

export const foci = [FOCUS_EXPLICATE, FOCUS_EXPANDING, FOCUS_FACTORING, FOCUS_IMPLICATE];

export const FOCUS_FLAGS_NONE = 0;
export const FOCUS_FLAGS_ALL = FOCUS_EXPLICATE | FOCUS_EXPANDING | FOCUS_FACTORING | FOCUS_IMPLICATE;
export const FOCUS_FLAGS_EXPANDING_UNION_FACTORING = FOCUS_EXPANDING | FOCUS_FACTORING;

export interface Operator<T extends U> {
    readonly key?: string;
    readonly name: string;
    readonly breaker?: boolean;
    readonly hash?: string;
    readonly phases?: number;
    readonly dependencies?: FEATURE[];
    isImag(expr: T): boolean;
    isKind(expr: U): boolean;
    isMinusOne(expr: T): boolean;
    isOne(expr: T): boolean;
    isReal(expr: T): boolean;
    isScalar(expr: T): boolean;
    isVector(expr: T): boolean;
    isZero(expr: T): boolean;
    subst(expr: T, oldExpr: U, newExpr: U): U;
    toInfixString(expr: T): string;
    toListString(expr: T): string;
    transform(expr: U): [TFLAGS, U];
    valueOf(expr: T): U;
}

/**
 * A legacy (and less favored) alternative to using OperatorBuilder and Operator.
 */
export interface Extension<T extends U> {
    readonly key?: string;
    readonly name: string;
    readonly breaker?: boolean;
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
    toListString(expr: T, $: ExtensionEnv): string;
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U];
    valueOf(expr: T, $: ExtensionEnv): U;
}
