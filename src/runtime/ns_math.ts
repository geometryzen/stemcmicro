// The canonical keys for various mathematical symbols.
// These MUST be unique.
// These MUST be stable over time.
// Think of these as a universal standard identifying mathematical standards.
// Implementations do not need to couple to this file, but they should use it as a standard.

// TODO: Don't need to define functions; these are pluggabel and should not be centrally defined.

import { create_sym } from "../tree/sym/Sym";

/**
 * Addition
 */
export const MATH_ADD = create_sym('add');
/**
 * Subtraction
 */
export const MATH_SUB = create_sym('-');
/**
 * Division.
 */
export const MATH_DIV = create_sym('/');
/**
 * Multiplication.
 */
export const MATH_MUL = create_sym('*');
/**
 * Exponentiation.
 * JavaScript: Math.pow
 * Python:     math.pow
 * Scheme:     expt
 */
export const MATH_POW = create_sym('math.pow');
/**
 * The exterior or outer product. Uses '^' as the infix operator.
 * WARNING! This must be in the global namespace in order to match the function name in scripts.
 */
export const MATH_OUTER = create_sym('outer');
/**
 * The inner or scalar product, a map (binary operator) from two vectors in a vector space V to a field F.
 * Uses '|' as the infix operator.
 */
export const MATH_INNER = create_sym('inner');

export const MATH_INV = create_sym('inv');
/**
 * The left contraction.
 */
export const MATH_LCO = create_sym('<<');
/**
 * The right contraction.
 */
export const MATH_RCO = create_sym('>>');

export const MATH_SIN = create_sym('sin');
/**
 * succ
 */
export const MATH_SUCC = create_sym('succ');
/**
 * pred
 */
export const MATH_PRED = create_sym('pred');
/**
 * Approximately 2.71828.
 */
export const MATH_E = create_sym('e');
/**
 * Approximately 3.14159.
 */
export const MATH_PI = create_sym('pi');
/**
 * component e.g. (indexing into a tensor).
 */
export const MATH_COMPONENT = create_sym('component');
/**
 * factorial
 */
export const MATH_FACTORIAL = create_sym('factorial');
/**
 * iszero
 */
export const MATH_ISZERO = create_sym('iszero');
/**
 * '!='
 */
export const MATH_NE = create_sym('!=');
/**
 * '>='
 */
export const MATH_GE = create_sym('>=');
/**
 * '<'
 */
export const MATH_LT = create_sym('<');
/**
 * '>'
 */
export const MATH_GT = create_sym('>');
/**
 * '<='
 */
export const MATH_LE = create_sym('<=');
/**
 * '=='
 */
export const MATH_EQ = create_sym('==');
/**
 * ':'
 */
export const MATH_HAS_TYPE = create_sym(':');
/**
* tau(x) = 2 * pi * x
*/
export const MATH_TAU = create_sym('tau');
/**
 * WARNING: nil cannot be relied upon to be a Sym in the system. In fact, in this implementation
 * nil is implemented as a Cons. However, this symbolic constant can be used as a key for
 * naming the concept of the empty list.
 */
export const MATH_NIL = create_sym('nil');
export const MATH_IMU = create_sym('unit-imaginary-number');
