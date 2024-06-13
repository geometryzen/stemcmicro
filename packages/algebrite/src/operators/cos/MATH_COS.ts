import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";

/**
 * cos(x) = ... (pow series)
 */
export const MATH_COS = native_sym(Native.cos);
