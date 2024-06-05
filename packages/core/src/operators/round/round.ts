import { create_flt, create_int, create_sym, is_flt, is_num } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { is_rat_and_integer } from "@stemcmicro/helpers";
import { Cons, items_to_cons, U } from "@stemcmicro/tree";
import { cadr } from "../../tree/helpers";
import { evaluate_as_float } from "../float/float";

const ROUND = create_sym("round");

export function eval_round(arg: Cons, $: ExprContext): U {
    const result = yround($.valueOf(cadr(arg)), $);
    return result;
}

function yround(expr: U, $: ExprContext): U {
    if (!is_num(expr)) {
        return items_to_cons(ROUND, expr);
    }

    if (is_flt(expr)) {
        return create_flt(Math.round(expr.d));
    }

    if (is_rat_and_integer(expr)) {
        return expr;
    }

    const retval = evaluate_as_float(expr, $);
    if (is_flt(retval)) {
        return create_int(Math.round(retval.d));
    } else {
        return retval;
    }
}
