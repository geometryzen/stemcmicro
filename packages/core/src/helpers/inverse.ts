import { Err, is_flt, is_num, is_rat, Num } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { items_to_cons, U } from "@stemcmicro/tree";
import { MATH_POW } from "../runtime/ns_math";
import { negOne } from "../tree/rat/Rat";

/**
 * (inverse arg) => (pow arg -1)
 */
export function inverse(arg: U, $: Pick<ExprContext, "valueOf">): U {
    // console.lg("inverse", `${arg}`);
    const value = $.valueOf(arg);
    try {
        if (is_num(value)) {
            return invert_number(value);
        } else {
            return $.valueOf(items_to_cons(MATH_POW, value, negOne));
        }
    } finally {
        value.release();
    }
}

/**
 *
 */
export function invert_number(num: Num): Num | Err {
    if (num.isZero()) {
        return diagnostic(Diagnostics.Division_by_zero);
    }

    if (is_flt(num)) {
        return num.inv();
    }

    if (is_rat(num)) {
        return num.inv();
    }

    throw new Error();
}
