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
export const MATH_SIN = native_sym(Native.sin);
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
export const MATH_COMPONENT = native_sym(Native.component);
/**
 * factorial
 */
export const MATH_FACTORIAL = native_sym(Native.factorial);
/**
 * iszero
 */
export const MATH_ISZERO = create_sym('iszero');
/**
 * '<'
 */
export const MATH_LT = native_sym(Native.test_lt);
/**
 * '>'
 */
export const MATH_GT = native_sym(Native.test_gt);
/**
 * '<='
 */
export const MATH_LE = native_sym(Native.test_le);
/**
 * ':'
 */
export const MATH_HAS_TYPE = create_sym(':');
/**
* tau(x) = 2 * pi * x
*/
export const MATH_TAU = native_sym(Native.tau);
export const MATH_IMU = native_sym(Native.IMU);
