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
    component,
    condense,
    conj,
    cos,
    derivative,
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
    infinitesimal,
    inner,
    integral,
    inverse,
    iscomplex,
    isinfinitesimal,
    isreal,
    iszero,
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
    simplify,
    sin,
    spread,
    sqrt,
    /**
     * Standard part function
     * 
     * https://en.wikipedia.org/wiki/Standard_part_function
     */
    st,
    subst,
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