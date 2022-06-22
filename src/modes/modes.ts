/**
 * Determines whether numeric types are converted to floating point numbers for numeric evaluation.
 * 
 * The default value as false.
 */
export const evaluatingAsFloat = 'evaluatingAsFloat';
/**
 * Determines whether complex numbers are driven towards rectangular or polar notation.
 * 
 * The default value is false.
 */
export const evaluatingAsPolar = 'evaluatingAsPolar';
/**
 * Determines whether trigonometric functions are converted to exponential form.
 * 
 * The default is false.
 */
export const evaluatingTrigAsExp = 'evaluatingTrigAsExp';
/**
 * Determines whether zero terms are kept in sums in attempt to preserve the dynamic type.
 * The alternative is to use a canonical zero value, usually that for rational numbers.
 * 
 * The default value is false.
 */
export const keepZeroTermsInSums = 'keepZeroTermsInSums';
/**
 * Determines whether floating point numbers are rendered as EcmaScript numbers.
 * If not, floating point numbers are rendered in a proprietary format.
 * 
 * The default value is false.
 */
export const renderFloatAsEcmaScript = 'renderFloatAsEcmaScript';
/**
 * Determines whether caret token '^' will be used for exponentiation or for the exterior product.
 * Using the caret token for exponetitation is common in mathematical tools but not in programming languages.
 * 
 * The default value is false.
 */
export const useCaretForExponentiation = 'useCaretForExponentiation';