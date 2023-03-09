import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";

/**
 * exp(x) = (expt e x)
 */
export const MATH_EXP = native_sym(Native.exp);