import { imu, two } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { divide, prolog_eval_1_arg, subtract } from "@stemcmicro/helpers";
import { Cons, U } from "@stemcmicro/tree";
import { conj } from "../../helpers/conj";
import { rect } from "../../helpers/rect";

export function eval_imag(expr: Cons, $: ExprContext): U {
    return prolog_eval_1_arg(expr, im, $);
}

export function im(z: U, $: ExprContext): U {
    const x_plus_iy = rect(z, $);
    const x_minus_iy = conj(x_plus_iy, $);
    const two_iy = subtract($, x_plus_iy, x_minus_iy);
    const iy = divide(two_iy, two, $);
    const y = divide(iy, imu, $);
    return y;
}
