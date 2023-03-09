import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";

/**
 * cos(x) = ... (expt series)
 */
export const MATH_COS = native_sym(Native.cosine);