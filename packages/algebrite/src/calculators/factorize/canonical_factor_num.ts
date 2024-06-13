import { is_num, Num, one } from "@stemcmicro/atoms";
import { is_cons_opr_eq_multiply } from "@stemcmicro/helpers";
import { cons, is_cons, is_nil, U } from "@stemcmicro/tree";
import { canonicalize_mul } from "../canonicalize/canonicalize_mul";

/**
 * expr = canonical_factor_num_lhs(expr) * canonical_factor_num_rhs(expr)
 */
export function canonical_factor_num_lhs(expr: U): Num {
    if (is_cons(expr)) {
        const L0 = expr;
        if (is_cons_opr_eq_multiply(L0)) {
            const L1 = L0.cdr;
            if (is_nil(L1)) {
                return one;
            } else {
                const first = L1.car;
                if (is_num(first)) {
                    return first;
                } else {
                    return one;
                }
            }
        } else {
            return one;
        }
    } else {
        return one;
    }
}

/**
 * expr = canonical_factor_num_lhs(expr) * canonical_factor_num_rhs(expr)
 */
export function canonical_factor_num_rhs(expr: U): U {
    if (is_cons(expr)) {
        const L0 = expr;
        if (is_cons_opr_eq_multiply(L0)) {
            const L1 = L0.cdr;
            if (is_nil(L1)) {
                return one;
            } else {
                const first = L1.car;
                if (is_num(first)) {
                    const L2 = L1.cdr;
                    return canonicalize_mul(cons(L0.opr, L2));
                } else {
                    return L0;
                }
            }
        } else {
            return L0;
        }
    } else {
        return expr;
    }
}
