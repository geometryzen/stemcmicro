import { U } from '../tree';
import { Adapter } from './Adapter';

export interface Metric<T> {
    /**
     * 
     * @param blade The bitmap representation of the blade.
     */
    toEigenBasis(blade: MaskAndWeight<T>): MaskAndWeight<T>[];
    getEigenMetric(): T[];
    toMetricBasis(blades: MaskAndWeight<T>[]): MaskAndWeight<T>[];
}

/**
 * The representation of a weighted blade.
 */
export interface MaskAndWeight<T> {
    /**
     * A bitmap indicating which blade.
     */
    bitmap: number;
    /**
    * The weight of the blade.
    */
    weight: T;
    neg(): MaskAndWeight<T>;
    wedge(rhs: MaskAndWeight<T>): MaskAndWeight<T>;
    grade(): number;
    reverse(): MaskAndWeight<T>;
    asString(names?: string[]): string;
    toString(): string;
}

/**
 *
 */
export interface BasisBlade<T, K> extends U {
    /**
     * The bitmap representation.
     */
    bitmap: number;
    add(rhs: BasisBlade<T, K>): K;
    /**
     * 
     * @param n The dimensionality of the vector space (not the algebra space).
     * @param names The names of the basis vectors (n) or algebra elements (2^n).
     * @param wedge The token to use to denote the outer product.
     */
    asString(n: number, names: string[], wedge: string): string;
    contains(needle: U): boolean;
    /**
     * dual(M) = M << I, where I is the pseudoscalar of the space.
     */
    dual(): K | BasisBlade<T, K>;
    equals(rhs: U): boolean;
    extractGrade(grade: number): K;
    lshift(rhs: BasisBlade<T, K>): K;
    mul(rhs: BasisBlade<T, K>): K;
    rev(): K;
    rshift(rhs: BasisBlade<T, K>): K;
    scalarCoordinate(): T;
    scp(rhs: BasisBlade<T, K>): K;
    sub(rhs: BasisBlade<T, K>): K;
    toInfixString(): string;
    toLatexString(): string;
    toListString(): string;
    toString(): string;
    wedge(rhs: BasisBlade<T, K>): K;
}


export interface Algebra<T, K> {
    field: Adapter<T, K>;
    /**
     * Honoring Grassmann, who called the basis vectors "units".
     */
    unit(index: number): BasisBlade<T, K>;
    /**
     * An alternate way of accessing the basis vectors.
     */
    units: BasisBlade<T, K>[];
}
