import { is_flt, is_rat, one, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { is_cons_opr_eq_add, is_cons_opr_eq_power, is_negative, negate } from "@stemcmicro/helpers";
import { cadr, Cons, is_cons, items_to_cons, U } from "@stemcmicro/tree";
import { DIRAC } from "./runtime/constants";

export function eval_dirac(expr: Cons, $: ExprContext): U {
    return dirac($.valueOf(cadr(expr)), $);
}

export function dirac(x: U, $: ExprContext): U {
    if (is_flt(x)) {
        if (x.isZero()) {
            return one;
        }
        return zero;
    }

    if (is_rat(x)) {
        if (x.isZero()) {
            return one;
        }
        return zero;
    }

    if (is_cons(x) && is_cons_opr_eq_power(x)) {
        return items_to_cons(DIRAC, x.base);
    }

    if (is_negative(x)) {
        return items_to_cons(DIRAC, negate($, x));
    }

    if (is_negative(x) || (is_cons(x) && is_cons_opr_eq_add(x) && is_negative(cadr(x)))) {
        x = negate($, x);
    }

    return items_to_cons(DIRAC, x);
}
