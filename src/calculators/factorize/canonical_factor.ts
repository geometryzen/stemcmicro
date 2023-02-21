import { is_mul } from "../../operators/mul/is_mul";
import { cons, is_cons, U } from "../../tree/tree";
import { canonicalize_mul } from "../canonicalize/canonicalize_mul";

export function canonical_factor_lhs(expr: U): U {
    const L0 = expr;
    if (is_cons(L0)) {
        if (is_mul(L0)) {
            const L1 = L0.cdr;
            return L1.car;
        }
        else {
            throw new Error();
        }
    }
    else {
        throw new Error();
    }
}

export function canonical_factor_rhs(expr: U): U {
    const L0 = expr;
    if (is_cons(L0)) {
        if (is_mul(L0)) {
            const L1 = L0.cdr;
            const L2 = L1.cdr;
            return canonicalize_mul(cons(L0.opr, L2));
        }
        else {
            throw new Error();
        }
    }
    else {
        throw new Error();
    }
}
