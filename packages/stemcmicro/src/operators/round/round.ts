import { create_flt, create_int, is_flt, is_num } from "@stemcmicro/atoms";
import { Cons, items_to_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_rat_and_integer } from "../../is_rat_and_integer";
import { ROUND } from "../../runtime/constants";
import { cadr } from "../../tree/helpers";
import { evaluate_as_float } from "../float/float";

export function eval_round(p1: Cons, $: ExtensionEnv): U {
    const result = yround($.valueOf(cadr(p1)), $);
    return result;
}

function yround(expr: U, $: ExtensionEnv): U {
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
