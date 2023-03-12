import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { items_to_cons, U } from "../../tree/tree";

const MATH_LOG = native_sym(Native.log);
const MATH_MUL = native_sym(Native.multiply);
const IMAG = native_sym(Native.imag);

export function compute_theta_from_base_and_expo(base: U, expo: U, $: ExtensionEnv): U {
    const log_base = $.valueOf(items_to_cons(MATH_LOG, base));
    const expo_times_log_base = $.valueOf(items_to_cons(MATH_MUL, expo, log_base));
    const theta = $.valueOf(items_to_cons(IMAG, expo_times_log_base));
    return theta;
}