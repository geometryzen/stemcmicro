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
export const MATH_COS = native_sym(Native.cos);
export const MATH_TAN = native_sym(Native.tan);
export const MATH_SUB = native_sym(Native.subtract);
export const MATH_MUL = native_sym(Native.multiply);
export const MATH_DIV = native_sym(Native.divide);
export const MATH_POW = native_sym(Native.pow);
export const MATH_OUTER = native_sym(Native.outer);
export const MATH_INNER = native_sym(Native.inner);
export const MATH_INV = native_sym(Native.inv);
export const MATH_LCO = native_sym(Native.lco);
export const MATH_RCO = native_sym(Native.rco);
export const MATH_SIN = native_sym(Native.sin);
export const MATH_SUCC = native_sym(Native.succ);
export const MATH_PRED = native_sym(Native.pred);
export const MATH_E = native_sym(Native.E);
export const MATH_PI = native_sym(Native.PI);
export const MATH_FACTORIAL = native_sym(Native.factorial);
export const MATH_ISZERO = native_sym(Native.iszero);
export const MATH_LT = native_sym(Native.testlt);
export const MATH_GT = native_sym(Native.testgt);
export const MATH_LE = native_sym(Native.testle);
/**
 * ':'
 */
export const MATH_HAS_TYPE = create_sym(':');
/**
* tau(x) = 2 * pi * x
*/
export const MATH_TAU = native_sym(Native.tau);
export const MATH_IMU = native_sym(Native.IMU);
