import { ExtensionEnv } from "../../env/ExtensionEnv";
import { U } from "../../tree/tree";

export function compute_theta_from_base_and_expo(base: U, expo: U, $: ExtensionEnv): U {
    const log_base = $.log(base);
    const expo_times_log_base = $.multiply(expo, log_base);
    const theta = $.im(expo_times_log_base);
    return theta;
}