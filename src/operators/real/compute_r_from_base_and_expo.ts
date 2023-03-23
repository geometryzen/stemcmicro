import { ExtensionEnv } from "../../env/ExtensionEnv";
import { U } from "../../tree/tree";

export function compute_r_from_base_and_expo(base: U, expo: U, $: ExtensionEnv): U {
    // console.lg("compute_r_from_base_and_expo", $.toInfixString(base), $.toInfixString(expo));

    // console.lg("base", $.toInfixString(base));
    // console.lg("expo", $.toInfixString(expo));
    const log_base = $.log(base);
    // console.lg("log_base", $.toInfixString(log_base));
    const expo_times_log_base = $.multiply(expo, log_base);
    // console.lg("expo_times_log_base", $.toInfixString(expo_times_log_base));
    const real_expo_times_log_base = $.re(expo_times_log_base);
    // console.lg("real_expo_times_log_base", $.toInfixString(real_expo_times_log_base));
    const r = $.exp(real_expo_times_log_base);
    // console.lg("r", $.toInfixString(r));
    return r;
}
