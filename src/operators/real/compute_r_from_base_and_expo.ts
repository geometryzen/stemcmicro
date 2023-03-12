import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { items_to_cons, U } from "../../tree/tree";

const EXP = native_sym(Native.exp);
const MATH_LOG = native_sym(Native.log);
const MATH_MUL = native_sym(Native.multiply);
const REAL = native_sym(Native.real);

export function compute_r_from_base_and_expo(base: U, expo: U, $: ExtensionEnv): U {
    // console.lg("base", $.toInfixString(base));
    // console.lg("expo", $.toInfixString(expo));
    const log_base = $.valueOf(items_to_cons(MATH_LOG, base));
    // console.lg("log_base", $.toInfixString(log_base));
    const expo_times_log_base = $.valueOf(items_to_cons(MATH_MUL, expo, log_base));
    // console.lg("expo_times_log_base", $.toInfixString(expo_times_log_base));
    const real_expo_times_log_base = $.valueOf(items_to_cons(REAL, expo_times_log_base));
    // console.lg("real_expo_times_log_base", $.toInfixString(real_expo_times_log_base));
    const r = $.valueOf(items_to_cons(EXP, real_expo_times_log_base));
    // console.lg("r", $.toInfixString(r));
    return r;
}
