import { imu } from "@stemcmicro/atoms";
import { Cons, U } from "@stemcmicro/tree";
import { complex_conjugate } from "../complex_conjugate";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { cadr } from "../tree/helpers";

export function eval_conjugate(expr: Cons, $: ExtensionEnv): U {
    const z = $.valueOf(cadr(expr));
    if (!z.contains(imu)) {
        // example: (-1)^(1/3)
        return $.clock(complex_conjugate($.polar(z), $));
    } else {
        return complex_conjugate(z, $);
    }
}
