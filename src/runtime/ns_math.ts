// The canonical keys for various mathematical symbols.
// These MUST be unique.
// These MUST be stable over time.
// Think of these as a universal standard identifying mathematical standards.
// Implementations do not need to couple to this file, but they should use it as a standard.

// TODO: Don't need to define functions; these are pluggabel and should not be centrally defined.

import { Native } from "../native/Native";
import { native_sym } from "../native/native_sym";
import { create_sym } from "../tree/sym/Sym";

export const MATH_ADD = native_sym(Native.add);
export const MATH_SUB = native_sym(Native.subtract);
export const MATH_MUL = native_sym(Native.multiply);
export const MATH_DIV = native_sym(Native.divide);
export const MATH_POW = native_sym(Native.pow);
export const MATH_OUTER = native_sym(Native.outer);
export const MATH_INNER = native_sym(Native.inner);
export const MATH_INV = native_sym(Native.inverse);
export const MATH_LCO = native_sym(Native.lco);
export const MATH_RCO = native_sym(Native.rco);
export const MATH_SIN = native_sym(Native.sine);
export const MATH_SUCC = native_sym(Native.succ);
/**
 * pred
 */
export const MATH_PRED = create_sym('pred');
export const MATH_E = native_sym(Native.E);
export const MATH_PI = native_sym(Native.PI);
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
export const MATH_IMU = native_sym(Native.IMU);
