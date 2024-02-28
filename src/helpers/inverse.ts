import { Err } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { diagnostic, Diagnostics } from "../diagnostics/diagnostics";
import { is_flt } from "../operators/flt/is_flt";
import { is_num } from "../operators/num/is_num";
import { is_rat } from "../operators/rat/is_rat";
import { MATH_POW } from "../runtime/ns_math";
import { Num } from "../tree/num/Num";
import { negOne } from "../tree/rat/Rat";
import { items_to_cons, U } from "../tree/tree";

/**
 * (inverse arg) => (pow arg -1)
 */
export function inverse(arg: U, $: Pick<ExprContext, 'valueOf'>): U {
    // console.lg("inverse", `${arg}`);
    const value = $.valueOf(arg);
    try {
        if (is_num(value)) {
            return invert_number(value);
        }
        else {
            return $.valueOf(items_to_cons(MATH_POW, value, negOne));
        }
    }
    finally {
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

