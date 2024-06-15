import { two } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { add, divide, prolog_eval_1_arg } from "@stemcmicro/helpers";
import { Cons, U } from "@stemcmicro/tree";
import { conj } from "../../helpers/conj";
import { rect } from "../../helpers/rect";

export function eval_real(expr: Cons, $: ExprContext): U {
    return prolog_eval_1_arg(expr, re, $);
}

export function re(z: U, $: ExprContext): U {
    const x_plus_iy = rect(z, $);
    const x_minus_iy = conj(x_plus_iy, $);
    const two_x = add($, x_plus_iy, x_minus_iy);
    const x = divide(two_x, two, $);
    return x;
}
