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
    __neg__(): MaskAndWeight<T>;
    __wedge__(rhs: MaskAndWeight<T>): MaskAndWeight<T>;
    cliffordConjugate(): MaskAndWeight<T>;
    grade(): number;
    gradeInversion(): MaskAndWeight<T>;
    isOne(): boolean;
    isScalar(): boolean;
    isZero(): boolean;
    reverse(): MaskAndWeight<T>;
    zero(): MaskAndWeight<T>;
    asString(names?: string[]): string;
    toString(): string;
}

/**
 * TODO: Trim down this interface if methods are not used by the symbolic library.
 */
export interface BasisBlade<T, K> extends U {
    /**
     * The bitmap representation.
     */
    bitmap: number;
    __abs__(): K;
    __add__(rhs: BasisBlade<T, K> | K): K;
    __radd__(rhs: BasisBlade<T, K>): K;
    __sub__(rhs: BasisBlade<T, K>): K;
    __rsub__(rhs: BasisBlade<T, K>): K;
    __mul__(rhs: T | BasisBlade<T, K>): K;
    __rmul__(lhs: T | BasisBlade<T, K>): K;
    __div__(rhs: T | BasisBlade<T, K>): K;
    __lshift__(rhs: BasisBlade<T, K>): K;
    __rshift__(rhs: BasisBlade<T, K>): K;
    __vbar__(rhs: BasisBlade<T, K>): K;
    __wedge__(rhs: BasisBlade<T, K>): K;
    __eq__(rhs: BasisBlade<T, K>): boolean;
    __ge__(rhs: BasisBlade<T, K>): boolean;
    __gt__(rhs: BasisBlade<T, K>): boolean;
    __le__(rhs: BasisBlade<T, K>): boolean;
    __lt__(rhs: BasisBlade<T, K>): boolean;
    __ne__(rhs: BasisBlade<T, K>): boolean;
    __bang__(): K;
    __pos__(): K;
    __neg__(): K;
    __tilde__(): K;
    add(rhs: BasisBlade<T, K>): K;
    asString(names: string[]): string;
    cliffordConjugate(): K;
    /**
     * This doesn't really make sense now that this structure is a blade.
     * direction(M) = M / sqrt(M * ~M)
     */
    direction(): K;
    div(rhs: BasisBlade<T, K>): K;
    divByScalar(alpha: T): K;
    /**
     * dual(M) = M << I, where I is the pseudoscalar of the space.
     */
    dual(): K | BasisBlade<T, K>;
    contains(needle: U): boolean;
    equals(rhs: U): boolean;
    /**
     * Returns the universal exponential function, exp, applied to this, i.e. exp(this).
     */
    exp(): K;
    extractGrade(grade: number): K;
    gradeInversion(): K;
    inv(): K;
    isCompatible(rhs: BasisBlade<T, K>): boolean;
    map(f: (weight: T) => T): K
    mul(rhs: BasisBlade<T, K>): K;
    neg(): K;
    rev(): K;
    scalarCoordinate(): T;
    /**
     * Returns the scalar product of this multivector with rhs, i.e. this | rhs.
     */
    scp(rhs: BasisBlade<T, K>): K;
    sqrt(): K;
    sub(rhs: BasisBlade<T, K>): K;
    toInfixString(): string;
    toLatexString(): string;
    toListString(): string;
    toString(): string;
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
