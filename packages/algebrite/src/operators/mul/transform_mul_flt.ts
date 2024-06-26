import { is_flt, zeroAsFlt } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { count_factors } from "@stemcmicro/helpers";
import { Cons, U } from "@stemcmicro/tree";

const is_flt_and_zero = (expr: U) => is_flt(expr) && expr.isZero();

/**
 * If a Flt with value zero exists as a factor in a multiplicative expression then the expression simplifies to zero (Flt).
 * @param expr
 * @param $
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transform_mul_flt(expr: Cons, $: ExprContext): U {
    // console.lg("transform_mul_flt");
    // TODO: This works even though I am not evaluating the arguments.
    // Do the factors need to be evaluated for this to do its job?
    if (count_factors(expr, is_flt_and_zero) === 1) {
        return zeroAsFlt;
    }
    return expr;
}
