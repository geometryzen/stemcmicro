import { is_num, Num, one, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { compare_num_num } from "@stemcmicro/helpers";
import { Cons, is_cons, U } from "@stemcmicro/tree";
import { guess } from "../../guess";
import { is_power } from "../../runtime/helpers";

/**
 * (deg p x)
 */
export function eval_deg(expr: Cons, $: Pick<ExprContext, "valueOf">): U {
    const argList = expr.argList;
    try {
        const arg0 = argList.item0;
        const arg1 = argList.item1;
        try {
            const P = $.valueOf(arg0);
            const X = $.valueOf(arg1);
            if (X.isnil) {
                return degree(P, guess(P));
            } else {
                return degree(P, X);
            }
        } finally {
            arg0.release();
            arg1.release();
        }
    } finally {
        argList.release();
    }
}

export function degree(P: U, X: U): Num {
    return yydegree(P, X, zero);
}

function yydegree(P: U, X: U, d: Num): Num {
    if (P.equals(X)) {
        if (d.isZero()) {
            return one;
        } else {
            return d;
        }
    } else if (is_cons(P)) {
        if (is_power(P)) {
            const base = P.base;
            const expo = P.expo;
            if (base.equals(X) && is_num(expo) && compare_num_num(d, expo) < 0) {
                return expo;
            } else {
                return d;
            }
        } else {
            return P.tail().reduce(function (prev: Num, curr: U) {
                return yydegree(curr, X, prev);
            }, d);
        }
    } else {
        return d;
    }
}
