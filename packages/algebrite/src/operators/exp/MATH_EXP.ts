import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";

/**
 * exp(x) = (pow e x)
 */
export const MATH_EXP = native_sym(Native.exp);
