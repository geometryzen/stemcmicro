/**
 * Determines how an expression is evaluated.
 */
export enum Directive {
    /**
     * Convert familiar expressions to canonical form. Mutually exclusive with familiarize.
     */
    canonicalize,
    /**
     * Replace sin with cos. Mutually exclusive with convertCosToSim.
     */
    convertSinToCos,
    /**
     * Replace cos with sin. Mutually exclusive with convertSinToCos.
     */
    convertCosToSin,
    /**
     * Convert canonical expressions to familiar form. Mutually exclusive with canonicalize.
     */
    familiarize,
    /**
     * Is not the same as the expand function.
     * Mutually exclusive with factoring.
     */
    expanding,
    /**
     * Determines whether abs(a + b + c ...) is expanded.
     */
    expandAbsSum,
    /**
     * Determines whether cos(a + b + c ...) is expanded.
     */
    expandCosSum,
    /**
     * Determines whether (a + b + c ...) raised to a positive integer exponent is expanded.
     * The default is true.
     */
    expandPowSum,
    /**
     * Determines whether cos(a + b + c ...) is expanded.
     */
    expandSinSum,
    /**
     * Determines whether numeric types are converted to floating point numbers for numeric evaluation.
     *
     * The default value as false.
     */
    evaluatingAsFloat,
    /**
     * Determines whether complex numbers are driven towards clock form.
     * The other possibilities are polar and rectanglular.
     *
     * The default value is false.
     */
    complexAsClock,
    /**
     * Determines whether complex numbers are driven towards polar form.
     * The other possibilities are clock and rectanglular.
     *
     * The default value is false.
     */
    complexAsPolar,
    /**
     * Determines whether complex numbers are driven towards rectangular form.
     * The other possibilities are clock and polar.
     *
     * The default value is false.
     */
    complexAsRectangular,
    /**
     * Determines whether exponential functions are converted ti exponential form.
     */
    convertExpToTrig,
    /**
     * Determines whether trigonometric functions are converted to exponential form.
     *
     * The default is false.
     */
    convertTrigToExp,
    /**
     * Determines whether zero terms are kept in sums in attempt to preserve the dynamic type.
     * The alternative is to use a canonical zero value, usually that for rational numbers.
     *
     * The default value is false.
     */
    keepZeroTermsInSums,
    /**
     * Is not the same as the factor function.
     * Mutually exclusive with expanding.
     */
    factoring,
    /**
     * Determines whether floating point numbers are rendered as EcmaScript numbers.
     * If not, floating point numbers are rendered in a proprietary format.
     *
     * The default value is false.
     */
    renderFloatAsEcmaScript,
    /**
     * Determines whether caret token '^' will be used for exponentiation or for the exterior product.
     * Using the caret token for exponetitation is common in mathematical tools but not in programming languages.
     *
     * The default value is false.
     */
    useCaretForExponentiation,
    /**
     * Determines whether test funtions will return Boo or Rat values.
     *
     * The default value is false.
     */
    useIntegersForPredicates,
    useParenForTensors,
    depth,
    drawing,
    nonstop,
    forceFixedPrintout,
    maxFixedPrintoutDigits,
    printMode,
    codeGen
}
