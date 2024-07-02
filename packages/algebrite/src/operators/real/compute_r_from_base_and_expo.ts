import { ExprContext } from "@stemcmicro/context";
import { exp, log, multiply } from "@stemcmicro/helpers";
import { cons_real } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";

export function compute_r_from_base_and_expo(base: U, expo: U, $: Pick<ExprContext, "valueOf">): U {
    const a = log(base, $);
    try {
        const b = multiply($, expo, a);
        try {
            const c = cons_real(b);
            try {
                return exp(c, $);
            } finally {
                c.release();
            }
        } finally {
            b.release();
        }
    } finally {
        a.release();
    }
}
