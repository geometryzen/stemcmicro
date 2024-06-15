import { imu } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { negate, subst } from "@stemcmicro/helpers";
import { U } from "@stemcmicro/tree";

/**
 * Replaces all occurences of imu with -imu, and evaluates the result.
 */
export function complex_conjugate(expr: U, $: Pick<ExprContext, "handlerFor" | "valueOf">): U {
    const minus_i = negate($, imu);
    const z_star = subst(expr, imu, minus_i, $);
    return $.valueOf(z_star);
}
