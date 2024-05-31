export enum PrintMode {
    /**
     * Two-dimensional rendering.
     */
    Ascii = 0,
    /**
     * Like infix but with extra whitespace and may have multiplication operators removed.
     */
    Human = 1,
    /**
     * Infix is how we normally write math but whitespace is removed and may be parsed by a computer.
     */
    Infix = 2,
    /**
     * MathJax compatible.
     */
    LaTeX = 3,
    /**
     * Symbolic Expression is LISP-like.
     */
    SExpr = 4,
    EcmaScript = 5
}
