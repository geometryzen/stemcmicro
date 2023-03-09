import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";

/**
 * abs(x) = ... (expt (| x x) 1/2)
 */
export const MATH_ABS = native_sym(Native.abs);