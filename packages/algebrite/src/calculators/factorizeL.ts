import { is_rat, one, Rat, Sym } from "@stemcmicro/atoms";
import { is_cons_opr_eq_multiply, is_cons_opr_eq_power } from "@stemcmicro/helpers";
import { Cons, Cons2, is_cons, is_cons2, items_to_cons, U } from "@stemcmicro/tree";
import { MATH_MUL, MATH_POW } from "../runtime/ns_math";

function is_pow_2_any_positive_integer(expr: Cons): expr is Cons2<Sym, U, Rat> {
    if (is_cons_opr_eq_power(expr)) {
        const expo = expr.expo;
        try {
            return is_rat(expo) && expo.isPositiveInteger();
        } finally {
            expo.release();
        }
    }
    return false;
}

/**
 * WARNING: This will not work for n-ary multiplication with n > 2.
 */
export function factorizeL(expr: U): [lhs: U, rhs: U, split: boolean] {
    let s = expr;
    const parts: U[] = [];
    while (is_cons(s)) {
        if (is_cons_opr_eq_multiply(s) && is_cons2(s)) {
            parts.push(s.rhs);
            s = s.lhs;
            continue;
        }
        if (is_pow_2_any_positive_integer(s)) {
            const base = s.lhs;
            const expo = s.rhs;
            parts.push(items_to_cons(MATH_POW, base, expo.pred()));
            s = base;
        }
        break;
    }

    while (parts.length > 1) {
        const a = parts.pop() as U;
        const b = parts.pop() as U;
        const ab = items_to_cons(MATH_MUL, a, b);
        parts.push(ab);
    }
    if (parts.length > 0) {
        return [s, parts[0], true];
    } else {
        return [s, one, false];
    }
}
