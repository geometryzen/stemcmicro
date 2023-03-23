import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";

/**
 * exp(x) = (pow e x)
 */
export const MATH_EXP = native_sym(Native.exp);