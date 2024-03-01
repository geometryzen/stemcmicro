/**
 * Type definitions in support of STEMCmicro scripting language running in
 * the microsoft monaco code editor with TypeScript support.
 * 
 * Copyright (c) 2022-2024 David Holmes
 */

//==============================================================================
// Types
//==============================================================================
declare class Blade {
}

declare class Sym {
}

declare class Uom {
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type U = any

//==============================================================================
// Functions
//==============================================================================

/**
 * @returns the absolute value or vector length of `x`.
 */
declare function abs(x: U): U

/**
 * @returns the adjunt of marix `m`, Adjunt is equal to determinant times inverse.
 */
declare function adj(m: U): U

/**
 * @returns true if all arguments are true. Returns false otherwise.
 */
declare function and(...a: U[]): U

/**
 * @returns the arc cosine of `x`.
 */
declare function arccos(x: U): U

/**
 * @returns the arc hyperbolic cosine of `x`.
 */
declare function arccosh(x: U): U

/**
 * @returns the arc sine of `x`.
 */
declare function arcsin(x: U): U

/**
 * @returns the arc hyperbolic sine of `x`.
 */
declare function arcsinh(x: U): U

/**
 * @returns the arc tangent of `y` over `x`. If `x` is omitted then `x`=1 is used.
 */
declare function arctan(y: U, x?: U): U

/**
 * @returns the arc hyperbolic tangent of `x`.
 */
declare function arctanh(x: U): U

/**
 * @returns the angle of complex `z`.
 */
declare function arg(z: U): U

/**
 * @returns the binding of the symbol `s` without evaluation.
 */
declare function binding(s: U): U

/**
 * @returns the smallest integer greater than or equal to `x`.
 */
declare function ceiling(x: U): U

/**
 * If `x` is true, then continue the script, else stop.
 */
declare function check(x: U): U

/**
 * @returns the binomial coefficient `n` choose `k`.
 */
declare function choose(n: U, k: U): U

/**
 * @returns the expression `x` with circular and hyperbolic function converted to exponentials.
 */
declare function circexp(x: U): U

/**
 * @returns complex `z` in polar form with base of negative one instead of `e`.
 */
declare function clock(z: U): U

/**
 * @returns the cofactor of matrix `m` for row `i` and column `j`.
 */
declare function cofactor(m: U, i: U, j: U): U

/**
 * @returns the complex conjugate of `z`.
 */
declare function conj(z: U): U

/**
 * @returns tensor `a` summed over indeices `i` and `j`. If `i` and `j` are omitted then `1` and `2` are used.
 */
declare function contract(a: U, i: U, j: U): U

/**
 * @returns the cosine of `x`.
 */
declare function cos(x: U): U

/**
 * @returns the hyperbolic cosine of `x`.
 */
declare function cosh(x: U): U

/**
 * @returns the cross product of vectors `u` and `v`.
 */
declare function cross(u: U, v: U): U

/**
 * @returns the hyperbolic cosine of `x`.
 */
declare function curl(v: U): U

/**
 * @returns the definite integral of `f` with respect to `x` evaluated from `a` to `b`.
 */
declare function defint(f: U, x: U, a: U, b: U): U

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/**
 * @returns the square root of `x`.
 */
declare function sqrt(x: U): U

//==============================================================================
// Algebras
//==============================================================================

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

//==============================================================================
// Metric (SI) Units of Measure
//==============================================================================

/**
 * SI Base Unit for electric current, symbol `A`
 */
declare const ampere: Sym;

/**
 * SI Base Unit for luminous intensity, symbol `cd`.
 */
declare const candela: Sym;

/**
 * `C`.
 */
declare const coulomb: Sym;

/**
 * F
 */
declare const farad: Sym;

/**
 * H
 */
declare const henry: Sym;

/**
 * Hz
 */
declare const hertz: Sym;

/**
 * J
 */
declare const joule: Sym;

/**
 * SI Base Unit for thermodynamic temperature, symbol K.
 */
declare const kelvin: Sym;

/**
 * SI Base Unit for mass, symbol kg.
 */
declare const kilogram: Sym;

/**
 * SI Base Unit for length, symbol m.
 */
declare const meter: Sym;

/**
 * SI Base Unit for length, symbol m.
 */
declare const metre: Sym;

/**
 * SI Base Unit for amount of substance, symbol mol.
 */
declare const mole: Sym;

/**
 * N
 */
declare const newton: Sym;

/**
 * Ω
 */
declare const ohm: Sym;

/**
 * Pa
 */
declare const pascal: Sym;

/**
 * SI Base Unit for time, symbol s.
 */
declare const second: Sym;

/**
 * S
 */
declare const siemens: Sym;

/**
 * T
 */
declare const tesla: Sym;

/**
 * V
 */
declare const volt: Sym;

/**
 * W
 */
declare const watt: Sym;

/**
 * Wb
 */
declare const weber: Sym;

//==============================================================================
// Metric (SI) Prefixes
//==============================================================================

/**
 * Prefix indicating one tenth (1/10 or 10e-1)
 */
declare const deci: Sym;

/**
 * Prefix indicating one hundredth (1/100 or 10e-2)
 */
declare const centi: Sym;

/**
 * Prefix indicating one thousandth (1/1000 or 10e-3)
 */
declare const milli: Sym;

/**
 * Prefix indicating one millionth (10e-6)
 */
declare const micro: Sym;

/**
 * Prefix indicating one billionth (10e-9)
 */
declare const nano: Sym;

/**
 * Prefix indicating one trillionth (10e-12)
 */
declare const pico: Sym;

/**
 * Prefix indicating one quadrillionth (10e-15)
 */
declare const femto: Sym;

/**
 * Prefix indicating one quintillionth (10e-18)
 */
declare const atto: Sym;

/**
 * Prefix indicating ten (10)
 */
declare const decka: Sym;

/**
 * Prefix indicating one hundred (100)
 */
declare const hecto: Sym;

/**
 * Prefix indicating one thousand (10**3)
 */
declare const kilo: Sym;

/**
 * Prefix indicating one million (10**6)
 */
declare const mega: Sym;

/**
 * Prefix indicating one billion (10**9)
 */
declare const giga: Sym;

/**
 * Prefix indicating one trillion (10**12)
 */
declare const tera: Sym;

/**
 * Prefix indicating one quadrillion (10**15)
 */
declare const peta: Sym;

/**
 * Prefix indicating one quintillion (10**18)
 */
declare const exa: Sym;
