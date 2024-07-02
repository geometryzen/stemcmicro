import { ExprContext } from "@stemcmicro/context";
import { imag, log, multiply } from "@stemcmicro/helpers";
import { U } from "@stemcmicro/tree";

/**
 * r * exp(i * theta) = base**expo => theta = imag(expo * log(base))
 */
export function compute_theta_from_base_and_expo(base: U, expo: U, $: Pick<ExprContext, "valueOf">): U {
    // log(r) + i * theta = expo * log(base)
    // theta = imag(expo * log(base))
    const a = log(base, $);
    try {
        const b = multiply($, expo, a);
        try {
            return imag(b, $);
        } finally {
            b.release();
        }
    } finally {
        a.release();
    }
}
