import { imu } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Cons, U } from "@stemcmicro/tree";
import { complex_conjugate } from "../complex_conjugate";
import { clock } from "../helpers/clock";
import { polar } from "../helpers/polar";
import { cadr } from "../tree/helpers";

export function eval_conjugate(expr: Cons, $: ExprContext): U {
    const z = $.valueOf(cadr(expr));
    if (!z.contains(imu)) {
        // example: (-1)^(1/3)
        return clock(complex_conjugate(polar(z, $), $), $);
    } else {
        // If the expr does contain imu, compute the complex conjugate through substitution.
        return complex_conjugate(z, $);
    }
}
