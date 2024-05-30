/**
 * Type definitions in support of STEMCmicro scripting language running in
 * the microsoft monaco code editor with TypeScript support.
 *
 * Copyright (c) 2022-2024 David Holmes
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type U = any;

//==============================================================================
// Functions
//==============================================================================

/**
 * Returns the absolute value or vector length of `x`.
 * @example
 * abs[x, y, z] => [x**2 + y**2 + z**2]**(1/2)
 */
declare function abs(x: U): U;

/**
 * Returns the adjunt of marix `m`, Adjunt is equal to determinant times inverse.
 */
declare function adj(m: U): U;

/**
 * Returns the basis of elements of an algebra using a `metric` and `labels` for the basis vectors.
 * @example
 * G30 = algebra([1, 1, 1], ["ex", "ey", "ez"])
 */
declare function algebra(metric: U, labels: U): U;

/**
 * Returns `true` if all arguments are `true`. Returns `false` otherwise.
 */
declare function and(...args: U[]): U;

/**
 * Returns the arc cosine of `x`.
 */
declare function arccos(x: U): U;

/**
 * Returns the arc hyperbolic cosine of `x`.
 */
declare function arccosh(x: U): U;

/**
 * Returns the arc sine of `x`.
 */
declare function arcsin(x: U): U;

/**
 * Returns the arc hyperbolic sine of `x`.
 */
declare function arcsinh(x: U): U;

/**
 * Returns the arc tangent of `y` over `x`. If `x` is omitted then `x`=1 is used.
 */
declare function arctan(y: U, x?: U): U;

/**
 * Returns the arc hyperbolic tangent of `x`.
 */
declare function arctanh(x: U): U;

/**
 * Returns the angle of complex `z`.
 */
declare function arg(z: U): U;

/**
 * Returns the Bessel function of the first kind.
 */
declare function besselj(x: U, n: U): U;

/**
 * Returns the Bessel function of the second kind.
 */
declare function bessely(x: U, n: U): U;

/**
 * Returns the binding of the symbol `s` without evaluation.
 */
declare function binding(s: U): U;

/**
 * Returns the smallest integer greater than or equal to `x`.
 */
declare function ceiling(x: U): U;

/**
 * If `x` is true, then continue the script, else stop.
 */
declare function check(x: U): U;

/**
 * Returns the binomial coefficient `n` choose `k`.
 */
declare function choose(n: U, k: U): U;

/**
 * Returns the expression `x` with circular and hyperbolic function converted to exponentials.
 */
declare function circexp(x: U): U;

/**
 * Returns complex `z` in polar form with base of negative one instead of `e`.
 */
declare function clock(z: U): U;

/**
 * Returns the coefficient of `x` to the `n` in the polynomial `p`.
 */
declare function coeff(p: U, x: U, n: U): U;

/**
 * Returns the cofactor of matrix `m` for row `i` and column `j`.
 */
declare function cofactor(m: U, i: U, j: U): U;

/**
 * Returns the complex conjugate of `z`.
 */
declare function conj(z: U): U;

/**
 * Returns tensor `a` summed over indeices `i` and `j`. If `i` and `j` are omitted then `1` and `2` are used.
 */
declare function contract(a: U, i: U, j: U): U;

/**
 * Returns the cosine of `x`.
 */
declare function cos(x: U): U;

/**
 * Returns the hyperbolic cosine of `x`.
 */
declare function cosh(x: U): U;

/**
 * Returns the cross product of vectors `u` and `v`.
 */
declare function cross(u: U, v: U): U;

/**
 * Returns the hyperbolic cosine of `x`.
 */
declare function curl(v: U): U;

/**
 * Returns the definite integral of `f` with respect to `x` evaluated from `a` to `b`.
 */
declare function defint(f: U, x: U, a: U, b: U): U;

/**
 * Returns the degree of polynomial `p` in the variable `x`.
 * @param p
 * @param x
 */
declare function deg(p: U, x: U): U;

/**
 * Returns the denominator of expression `x`.
 */
declare function denominator(x: U): U;

/**
 * Returns the determinant of matrix `m`.
 */
declare function det(m: U): U;

/**
 * Returns the dimension of the `n`th index of tensor `a`.
 */
declare function dim(a: U, n: U): U;

/**
 * Returns the divergence of vector `v` with respect to the symbols `x`, `y`, and `z`.
 */
declare function div(v: U): U;

// TODO: do is a problem because of name conflict in JavaScript.
// declare function do(...args: U[]): U

/**
 * Returns the dot product of vectors, matrices, and tensors.
 */
declare function dot(...arg: U[]): U;

/**
 * Drasw the graph of `f`(`x`). Drawing ranges can be set with `xrange` and `yrange`.
 */
declare function draw(f: U, x: U): U;

/**
 * Returns the eigenvalues for matrix `m`.
 */
declare function eigenval(m: U): U;

/**
 * Returns the eigenvectors for matrix `m`. Matrix `m` is required to be numerical, real, and symmetric.
 * The return value is a matrix with each column an eigenvector.
 */
declare function eigenvec(m: U): U;

/**
 * Return the error function of `x`.
 */
declare function erf(x: U): U;

/**
 * Return the complimentary error function of `x`.
 */
declare function erfc(x: U): U;

/**
 * Returns `f` evaluated with `x` replaced by `a`, etc. All arguments can be expressions.
 */
declare function eval(f: U, x: U, a: U, ...args: U[]): U;

/**
 * Returns the exponential of `x`.
 */
declare function exp(x: U): U;

/**
 * Returns the partial fraction expansion of the ratio of polynomials `r` in `x`;
 */
declare function expand(r: U, x: U): U;

/**
 * Returns the cosine of `z` in exponential form.
 */
declare function expcos(z: U): U;

/**
 * Returns the hyperbolic cosine of `z` in exponential form.
 */
declare function expcosh(z: U): U;

/**
 * Returns the sine of `z` in exponential form.
 */
declare function expsin(z: U): U;

/**
 * Returns the hyperbolic sine of `z` in exponential form.
 */
declare function expsinh(z: U): U;

/**
 * Returns the tangent of `z` in exponential form.
 */
declare function exptan(z: U): U;

/**
 * Returns the hyperbolic tangent of `z` in exponential form.
 */
declare function exptanh(z: U): U;

declare function factor(n: U): U;

declare function factor(p: U, x: U): U;

/**
 * Returns the factorial of `n`. The expression `n!` can also be used.
 */
declare function factorial(n: U): U;

declare function filter(f: U, ...omits: U[]): U;

/**
 * Returns expression `x` with rational numbers and integers converted to floating point values.
 */
declare function float(x: U): U;

declare function floor(x: U): U;

// declare function for(x: U): U

/**
 * Returns the greatest common divisor.
 */
declare function gcd(...args: U[]): U;

/**
 * Returns the gradient `derivative(f, [x, y, z])`.
 */
declare function grad(f: U): U;

/**
 * Returns the Hadamard (element-wise) product. The arguments are required to have the same dimensions.
 */
declare function hadamard(...args: U[]): U;

/**
 * Returns an `n` by `n` Hilbert matrix.
 */
declare function hilbert(n: U): U;

/**
 * Returns the `n`th Hermite polynomial in `x`.
 */
declare function hermite(x: U, n: U): U;

/**
 * Returns the imaginary part of complex `z`.
 */
declare function imag(z: U): U;

/**
 * Returns the expression `x` as a string in `infix` format.
 */
declare function infix(x: U): U;

/**
 * Returns the inner product of vectors, matrices, and tensors.
 */
declare function inner(...args: U[]): U;

/**
 * Returns the integral of `f` with respect to `x`.
 */
declare function integral(f: U, x: U): U;

/**
 * Returns the inverse of matrix `m`.
 */
declare function inv(m: U): U;

declare function isprime(n: U): U;

/**
 * Returns the kronecker product of vectors and matrices.
 */
declare function kronecker(...args: U[]): U;

/**
 * Returns the `n`th Laguerre polynomial in `x`.
 * @param x
 * @param n
 * @param a
 */
declare function laguerre(x: U, n: U, a: U): U;

/**
 * Returns the least common multiple.
 */
declare function lcm(...args: U[]): U;

/**
 * Returns the leading coefficient of the polynomial `p` in the variable `x`.
 * @param p
 * @param x
 */
declare function leading(p: U, x: U): U;

/**
 * Returns the natural logarithm of `x`.
 */
declare function log(x: U): U;

/**
 * Returns the contents of `x` without evaluating.
 */
declare function lookup(x: U): U;

/**
 * Returns the magnitude of complex `z`.
 */
declare function mag(z: U): U;

/**
 * Returns the minor of matrix `m` for row `i` and column `j`.
 */
declare function minor(m: U, i: U, j: U): U;

/**
 * Returns a copy of matrix `m` with row `i` and column `j` removed.
 */
declare function minormatrix(m: U, i: U, j: U): U;

/**
 * Returns the remainder of `a` divided by `b`.
 */
declare function mod(a: U, b: U): U;

/**
 * Evaluates expression `x` without expanding products of sums.
 */
declare function noexpand(x: U): U;

/**
 * Returns `false` if `x` is `true`. Returns `true` otherwise.
 */
declare function not(x: U): U;

/**
 * Returns the approximate roots of polynomial `p` in variable `x` with real or complex coefficients.
 */
declare function nroots(p: U, x?: U): U;

/**
 * Returns the numerator of expression `x`.
 */
declare function numerator(x: U): U;

/**
 * Returns `true` if at least one argument is `true`. Returns `false` otherwise.
 */
declare function or(...args: U[]): U;

/**
 * Returns the outer product of vectors, matrices, and tensors.
 */
declare function outer(...args: U[]): U;

/**
 * Returns the complex `z` in polar form.
 */
declare function polar(z: U): U;

/**
 * Returns the `n`th prime number.
 * @param n the one-based index of the prime number.
 */
declare function prime(n: U): U;

/**
 * For `i` equals `j` through `k` evaluate `f` and return the product of all the factors.
 * @param f
 * @param i
 * @param j
 * @param k
 */
declare function product(f: U, i: U, j: U, k: U): U;

/**
 * Returns expression x without evaluating it first.
 * @param x
 */
declare function quote(x: U): U;

/**
 * Returns the number of indices for tensor `a`.
 */
declare function rank(a: U): U;

/**
 * Returns the expression `x` with everything over a common denominator.
 */
declare function rationalize(x: U): U;

/**
 * Returns the real part of complex `z`.
 */
declare function real(z: U): U;

/**
 * Returns complex `z` in rectangular form.
 */
declare function rect(z: U): U;

/**
 * Returns the rational roots of polynomial `p` in variable `x`.
 */
declare function roots(p: U, x: U): U;

/**
 * Returns the vector `u` rotated according to to rotation codes.
 */
declare function rotate(u: U, ...codes: U): U;

/**
 * Returns a vector with the one integer for each dimension indicating the size of the dimension.
 * @param x
 */
declare function shape(x: U): U;

/**
 * Returns the expression `x` in a simpler form.
 */
declare function simplify(x: U): U;

/**
 * Returns the sine of `x`.
 */
declare function sin(x: U): U;

/**
 * Returns the hyperbolic sine of `x`.
 */
declare function sinh(x: U): U;

/**
 * Returns the square root of `x`.
 */
declare function sqrt(x: U): U;

/**
 * Returns the expression obtained by substituting `a` for `b` in the expression `c`.
 * @param a
 * @param b
 * @param c
 */
declare function subst(a: U, b: U, c: U): U;

/**
 * For `i` equals `j` through `k` evaluate `f` and return the sum of all the terms.
 * @param f
 * @param i
 * @param j
 * @param k
 */
declare function sum(f: U, i: U, j: U, k: U): U;

/**
 * Returns the tangent of `x`.
 */
declare function tan(x: U): U;

/**
 * Returns the hyperbolic tangent of `x`.
 */
declare function tanh(x: U): U;

/**
 * Returns the `n`th order Taylor series expansion of `f`(`x`) at `a`.
 */
declare function taylor(f: U, x: U, n: U, a: U): U;

// declare function test(...args: U[]): U

/**
 * Returns the transpose of tensor `a` with respect to indices `i` and `j`.
 * If `i` and `j` are omitted then `1` and `2` are used.
 */
declare function transpose(a: U, i?: U, j?: U): U;

/**
 * Returns an `n` by `n` identity matrix.
 */
declare function unit(n: U): U;

/**
 * Returns a null tensor with dimensions `i`, `j`, etc.
 */
declare function zero(...dims: U[]): U;

//==============================================================================
// Algebras
//==============================================================================

/**
 * The unit vector in the direction of the positive x-axis.
 */
declare const ex: U;

/**
 * The unit vector in the direction of the positive y-axis.
 */
declare const ey: U;

/**
 * The unit vector in the direction of the positive z-axis.
 */
declare const ez: U;

//==============================================================================
// Metric (SI) Units of Measure
//==============================================================================

/**
 * SI Base Unit for electric current, symbol `A`
 */
declare const ampere: U;

/**
 * SI Base Unit for luminous intensity, symbol `cd`.
 */
declare const candela: U;

/**
 * `C`.
 */
declare const coulomb: U;

/**
 * F
 */
declare const farad: U;

/**
 * H
 */
declare const henry: U;

/**
 * Hz
 */
declare const hertz: U;

/**
 * J
 */
declare const joule: U;

/**
 * SI Base Unit for thermodynamic temperature, symbol K.
 */
declare const kelvin: U;

/**
 * SI Base Unit for mass, symbol kg.
 */
declare const kilogram: U;

/**
 * SI Base Unit for length, symbol m.
 */
declare const meter: U;

/**
 * SI Base Unit for length, symbol m.
 */
declare const metre: U;

/**
 * SI Base Unit for amount of substance, symbol mol.
 */
declare const mole: U;

/**
 * N
 */
declare const newton: U;

/**
 * Ω
 */
declare const ohm: U;

/**
 * Pa
 */
declare const pascal: U;

/**
 * SI Base Unit for time, symbol s.
 */
declare const second: U;

/**
 * S
 */
declare const siemens: U;

/**
 * T
 */
declare const tesla: U;

/**
 * V
 */
declare const volt: U;

/**
 * W
 */
declare const watt: U;

/**
 * Wb
 */
declare const weber: U;

//==============================================================================
// Metric (SI) Prefixes
//==============================================================================

/**
 * Prefix indicating one tenth (1/10 or 10e-1)
 */
declare const deci: U;

/**
 * Prefix indicating one hundredth (1/100 or 10e-2)
 */
declare const centi: U;

/**
 * Prefix indicating one thousandth (1/1000 or 10e-3)
 */
declare const milli: U;

/**
 * Prefix indicating one millionth (10e-6)
 */
declare const micro: U;

/**
 * Prefix indicating one billionth (10e-9)
 */
declare const nano: U;

/**
 * Prefix indicating one trillionth (10e-12)
 */
declare const pico: U;

/**
 * Prefix indicating one quadrillionth (10e-15)
 */
declare const femto: U;

/**
 * Prefix indicating one quintillionth (10e-18)
 */
declare const atto: U;

/**
 * Prefix indicating ten (10)
 */
declare const decka: U;

/**
 * Prefix indicating one hundred (100)
 */
declare const hecto: U;

/**
 * Prefix indicating one thousand (10**3)
 */
declare const kilo: U;

/**
 * Prefix indicating one million (10**6)
 */
declare const mega: U;

/**
 * Prefix indicating one billion (10**9)
 */
declare const giga: U;

/**
 * Prefix indicating one trillion (10**12)
 */
declare const tera: U;

/**
 * Prefix indicating one quadrillion (10**15)
 */
declare const peta: U;

/**
 * Prefix indicating one quintillion (10**18)
 */
declare const exa: U;

//==============================================================================
// Constants
//==============================================================================

/**
 * Mathematical constant, Pi
 */
declare const pi: U;

//==============================================================================
// Variables
//==============================================================================

/**
 * Set `trace = 1` in a script to print the script as it is evaluated. Useful for debugging.
 */
declare let trace: U;

/**
 * Set `tty = 1` to show results in string format. Set `tty = 0` to turn off.
 */
declare let tty: U;
