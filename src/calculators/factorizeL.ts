import { is_positive_integer } from "../is";
import { BCons } from "../operators/helpers/BCons";
import { is_mul_2_any_any } from "../operators/mul/is_mul_2_any_any";
import { is_pow_2_any_any } from "../operators/pow/is_pow_2_any_any";
import { MATH_MUL, MATH_POW } from "../runtime/ns_math";
import { one, Rat } from "../tree/rat/Rat";
import { Sym } from "../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../tree/tree";

function is_pow_2_any_positive_integer(expr: Cons): expr is BCons<Sym, U, Rat> {
    if (is_pow_2_any_any(expr)) {
        const expo = expr.rhs;
        return is_positive_integer(expo);
    }
    return false;
}

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
            parts.push(makeList(MATH_POW, base, expo.pred()));
            s = base;
        }
        break;
    }

    while (parts.length > 1) {
        const a = parts.pop() as U;
        const b = parts.pop() as U;
        const ab = makeList(MATH_MUL, a, b);
        parts.push(ab);
    }
    if (parts.length > 0) {
        return [s, parts[0], true];
    }
    else {
        return [s, one, false];
    }
}
