import { is_rat, one, Rat, Sym } from "math-expression-atoms";
import { Cons, is_cons, items_to_cons, U } from "math-expression-tree";
import { Cons2 } from "../operators/helpers/Cons2";
import { is_mul_2_any_any } from "../operators/mul/is_mul_2_any_any";
import { is_pow_2_any_any } from "../operators/pow/is_pow_2_any_any";
import { MATH_MUL, MATH_POW } from "../runtime/ns_math";

function is_pow_2_any_positive_integer(expr: Cons): expr is Cons2<Sym, U, Rat> {
    if (is_pow_2_any_any(expr)) {
        const expo = expr.rhs;
        return is_rat(expo) && expo.isPositiveInteger();
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
        if (is_mul_2_any_any(s)) {
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
