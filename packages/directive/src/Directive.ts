/**
 * Determines how an expression is evaluated.
 */
export enum Directive {
    /**
     * Convert familiar expressions to canonical form. Mutually exclusive with familiarize.
     */
    canonicalize = 0,
    /**
     * Replace sin with cos. Mutually exclusive with convertCosToSim.
     */
    convertSinToCos = 1,
    /**
     * Replace cos with sin. Mutually exclusive with convertSinToCos.
     */
    convertCosToSin = 2,
    /**
     * Convert canonical expressions to familiar form. Mutually exclusive with canonicalize.
     */
    familiarize = 3,
    /**
     * Is not the same as the expand function.
     * Mutually exclusive with factoring.
     */
    expanding = 4,
    /**
     * Determines whether abs(a + b + c ...) is expanded.
     */
    expandAbsSum = 5,
    /**
     * Determines whether cos(a + b + c ...) is expanded.
     */
    expandCosSum = 6,
    /**
     * Determines whether (a + b + c ...) raised to a positive integer exponent is expanded.
     * The default is true.
     */
    expandPowSum = 7,
    /**
     * Determines whether cos(a + b + c ...) is expanded.
     */
    expandSinSum = 8,
    /**
     * Determines whether numeric types are converted to floating point numbers for numeric evaluation.
     *
     * The default value as false.
     */
    evaluatingAsFloat = 9,
    /**
     * Determines whether complex numbers are driven towards clock form.
     * The other possibilities are polar and rectanglular.
     *
     * The default value is false.
     */
    complexAsClock = 10,
    /**
     * Determines whether complex numbers are driven towards polar form.
     * The other possibilities are clock and rectanglular.
     *
     * The default value is false.
     */
    complexAsPolar = 11,
    /**
     * Determines whether complex numbers are driven towards rectangular form.
     * The other possibilities are clock and polar.
     *
     * The default value is false.
     */
    complexAsRectangular = 12,
    /**
     * Determines whether exponential functions are converted ti exponential form.
     */
    convertExpToTrig = 13,
    /**
     * Determines whether trigonometric functions are converted to exponential form.
     *
     * The default is false.
     */
    convertTrigToExp = 14,
    /**
     * Determines whether zero terms are kept in sums in attempt to preserve the dynamic type.
     * The alternative is to use a canonical zero value, usually that for rational numbers.
     *
     * The default value is false.
     */
    keepZeroTermsInSums = 15,
    /**
     * Is not the same as the factor function.
     * Mutually exclusive with expanding.
     */
    factoring = 16,
    /**
     * Determines whether floating point numbers are rendered as EcmaScript numbers.
     * If not, floating point numbers are rendered in a proprietary format.
     *
     * The default value is false.
     */
    renderFloatAsEcmaScript = 17,
    /**
     * Determines whether caret token '^' will be used for exponentiation or for the exterior product.
     * Using the caret token for exponetitation is common in mathematical tools but not in programming languages.
     *
     * The default value is false.
     */
    useCaretForExponentiation = 18,
    /**
     * Determines whether test funtions will return Boo or Rat values.
     *
     * The default value is false.
     */
    useIntegersForPredicates = 19,
    useParenForTensors = 20,
    depth = 21,
    drawing = 22,
    nonstop = 23,
    forceFixedPrintout = 24,
    maxFixedPrintoutDigits = 25,
    printMode = 26,
    codeGen = 27,
    traceLevel = 28
}
