import { count_factors } from "../../calculators/count_factors";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { zeroAsFlt } from "../../tree/flt/Flt";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";

const is_flt_and_zero = (expr: U) => is_flt(expr) && expr.isZero();

/**
 * If a Flt with value zero exists as a factor in a multiplicative expression then the expression simplifies to zero (Flt).
 * @param expr 
 * @param $ 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transform_mul_flt(expr: Cons, $: ExtensionEnv): U {
    // TODO: This works even though I am not evaluating the arguments.
    // Do the factors need to be evaluated for this to do its job?
    if (count_factors(expr, is_flt_and_zero) === 1) {
        return zeroAsFlt;
    }
    return expr;
}
