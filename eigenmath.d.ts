declare class Blade {

}

declare class Sym {

}

declare class Uom {

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type U = any

/**
 * Returns the cross product of vectors `u` and `v`.
 */
declare function cross(u: U, v: U): U

/**
 * returns the square root of `x`
 */
declare function sqrt(x: U): U

/**
 * The unit vector in the direction of the positive x-axis.
 */
declare const ex: Blade;

/**
 * The unit vector in the direction of the positive y-axis.
 */
declare const ey: Blade;

/**
 * The unit vector in the direction of the positive z-axis.
 */
declare const ez: Blade;

/**
 * Prefix indicating one million (10**6)
 */
declare const mega: Sym;

/**
 * Prefix indicating one thousand (10**3)
 */
declare const kilo: Sym;
