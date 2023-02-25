import { Rat } from "../tree/rat/Rat";
import { Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";
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
export type FEATURE = 'Blade' | 'Flt' | 'Imu' | 'Uom' | 'Vector' | '~Vector';

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

export interface ExprComparator {
    compare(lhs: U, rhs: U, $: ExtensionEnv): Sign;
}

export interface ExtensionEnv {
    getPrintHandler(): PrintHandler;
    setField(kind: 'R' | undefined): void;
    setPrintHandler(handler: PrintHandler): void;
    treatAsReal(sym: Sym): boolean;
    /**
     * 
     * @param lhs 
     * @param rhs 
     */
    add(lhs: U, rhs: U): U;
    /**
     *
     */
    arg(expr: U): U;
    beginSpecial(): void;
    clearBindings(): void;
    clearOperators(): void;
    clearRenamed(): void;
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
    getMode(): number;
    getModeFlag(mode: MODE): boolean;
    getSymbolOrder(sym: Sym): ExprComparator;
    getSymbolToken(sym: Sym): string;
    /**
     * Used to make the environment ready after all operator builders have been added.
     */
    buildOperators(): void;
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
    resetSymTab(): void;
    setAssocL(opr: Sym, value: boolean): void;
    setAssocR(opr: Sym, value: boolean): void;
    setBinding(sym: Sym, binding: U): void;
    setMode(mode: number): void;
    setModeFlag(mode: MODE, value: boolean): void;
    setSymbolOrder(sym: Sym, order: ExprComparator): void;
    setSymbolToken(sym: Sym, token: string): void;
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

export interface Operator<T extends U> {
    readonly key?: string;
    readonly name: string;
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
    toLatexString(expr: T): string;
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
