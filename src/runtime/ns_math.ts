// The canonical keys for various mathematical symbols.
// These MUST be unique.
// These MUST be stable over time.
// Think of these as a universal standard identifying mathematical standards.
// Implementations do not need to couple to this file, but they should use it as a standard.

// TODO: Don't need to define functions; these are pluggabel and should not be centrally defined.

import { Sym } from "../tree/sym/Sym";

export const MATH_NAMESPACE = new Sym('math');

/**
 * Addition
 */
export const MATH_ADD = new Sym('add');
/**
 * Subtraction
 */
export const MATH_SUB = new Sym('-');
/**
 * Division.
 */
export const MATH_DIV = new Sym('/');
/**
 * Multiplication.
 */
export const MATH_MUL = new Sym('*');
/**
 * Exponentiation.
 */
export const MATH_POW = new Sym('**');
/**
 * The exterior or outer product. Uses '^' as the infix operator.
 */
export const MATH_OUTER = new Sym('outer');
/**
 * The inner or scalar product, a map (binary operator) from two vectors in a vector space V to a field F.
 * Uses '|' as the infix operator.
 */
export const MATH_INNER = new Sym('|');

export const MATH_INV = new Sym('inv');
/**
 * The left contraction.
 */
export const MATH_LCO = new Sym('<<');
/**
 * The right contraction.
 */
export const MATH_RCO = new Sym('>>');

export const MATH_SIN = new Sym('sin');
/**
 * succ
 */
export const MATH_SUCC = new Sym('succ');
/**
 * pred
 */
export const MATH_PRED = new Sym('pred');
/**
 * Approximately 2.71828.
 */
export const MATH_E = new Sym('e');
/**
 * Approximately 3.14159.
 */
export const MATH_PI = new Sym('π');
/**
 * arg
 */
export const MATH_ARG = new Sym('arg');
/**
 * component e.g. (indexing into a tensor).
 */
export const MATH_COMPONENT = new Sym('component');
/**
 * factorial
 */
export const MATH_FACTORIAL = new Sym('factorial');
/**
 * iszero
 */
export const MATH_ISZERO = new Sym('iszero');
/**
 * '!='
 */
export const MATH_NE = new Sym('!=');
/**
 * '>='
 */
export const MATH_GE = new Sym('>=');
/**
 * '<'
 */
export const MATH_LT = new Sym('<');
/**
 * '>'
 */
export const MATH_GT = new Sym('>');
/**
 * '<='
 */
export const MATH_LE = new Sym('<=');
/**
 * '=='
 */
export const MATH_EQ = new Sym('==');
/**
 * ':'
 */
export const MATH_HAS_TYPE = new Sym(':');
/**
* tau(x) = 2 * π * x
*/
export const MATH_TAU = new Sym('tau');
/**
 * WARNING: nil cannot be relied upon to be a Sym in the system. In fact, in this implementation
 * nil is implemented as a Cons. However, this symbolic constant can be used as a key for
 * naming the concept of the empty list.
 */
export const MATH_NIL = new Sym('nil', MATH_NAMESPACE);
export const MATH_IMU = new Sym('unit-imaginary-number', MATH_NAMESPACE);
