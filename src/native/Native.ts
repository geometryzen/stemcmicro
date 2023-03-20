/**
 * Natively implemented concepts.
 * Uppercase elements correspond to constants.
 * Lowercase elements correspond to functions.
 */
export enum Native {
    // Constants (upper case)
    E,
    IMU,
    MASH,
    NIL,
    PI,
    // Functions (lower case)
    abs,
    add,
    arccos,
    arcsin,
    arctan,
    arg,
    clock,
    condense,
    conj,
    cos,
    divide,
    exp,
    expand,
    expsin,
    /**
     * Factor a polynomial or integer.
     */
    factor,
    factorial,
    float,
    imag,
    inner,
    integral,
    inverse,
    is_complex,
    is_real,
    is_zero,
    lco,
    log,
    /**
     * mod(a,b) returns the remainder of the result of a divided by b.
     */
    mod,
    multiply,
    not,
    outer,
    polar,
    pow,
    rationalize,
    real,
    rect,
    rco,
    sin,
    spread,
    sqrt,
    subtract,
    succ,
    /**
     * tau(x) = 2 * PI * x
     */
    tau,
    test,
    test_eq,
    test_ge,
    test_gt,
    test_le,
    test_lt,
    test_ne,
}