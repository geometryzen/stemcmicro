import { BasisBlade } from "./BasisBlade";

export type SumTerm<T, K> = { blade: BasisBlade<T, K>, weight: T }

/**
 * An interface that allows a Blade to interact with an arbitrary field,
 * and allows blades to be summed into tree representing a multivector.
 * 
 * F is the type of the field over which the multivector operates.
 * K is the type of the atom that represents a tree.
 */
export interface Adapter<T, K> {
    ε: T;
    one: T;
    zero: T;
    abs(arg: T): T;
    add(lhs: T, rhs: T): T;
    sub(lhs: T, rhs: T): T;
    eq(lhs: T, rhs: T): boolean;
    ne(lhs: T, rhs: T): boolean;
    le(lhs: T, rhs: T): boolean;
    lt(lhs: T, rhs: T): boolean;
    ge(lhs: T, rhs: T): boolean;
    gt(lhs: T, rhs: T): boolean;
    max(lhs: T, rhs: T): T;
    min(lhs: T, rhs: T): T;
    mul(lhs: T, rhs: T): T;
    div(lhs: T, rhs: T): T;
    neg(arg: T): T;
    asString(arg: T): string;
    cos(arg: T): T;
    isField(arg: T | BasisBlade<T, K>): arg is T;
    isOne(arg: T): boolean;
    isZero(arg: T): boolean;
    sin(arg: T): T;
    sqrt(arg: T): T;
    /**
     * Determines whether the argument can represent the dimension of a metric.
     * It must be possible to convert the argument to a number which is also a positive integer.
     * Supports the case where the metric is Euclidean and only the dimensionality need be known.
     */
    isDimension(arg: T): boolean;
    /**
     * Extracts the dimension of the metric from the argument.
     * Supports the case where the metric is Euclidean and only the dimensionality need be known.
     */
    dim(arg: T): number;
    /**
     * The implementation should calculate sum over terms of (term.blade * term.weight).
     * There is an assumption that the weight is a scalar quantity, i.e. it commutes with the blade.
     */
    sum(terms: SumTerm<T, K>[]): K;
    /**
     * Provides support for __vbar__ 
     */
    extractGrade(arg: K, grade: number): K;
    /**
     * 
     */
    treeAdd(lhs: K, rhs: K): K;
    /**
     * 
     */
    treeLco(lhs: K, rhs: K): K;
    /**
    * 
    */
    treeMul(lhs: K, rhs: K): K;
    /**
     * 
     */
    treeScp(lhs: K, rhs: K): K;
    /**
     *
     */
    treeSqrt(arg: K): K;
    /**
     * 
     */
    treeZero(): K;
    /**
     *
     */
    weightToTree(arg: T): K;
    /**
     * 
     */
    scalarCoordinate(arg: K): T;
    /**
     * 
     */
    bladeToTree(blade: BasisBlade<T, K>): K;
}
