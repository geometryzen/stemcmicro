import { is_mul } from "../../operators/mul/is_mul";
import { is_num } from "../../operators/num/is_num";
import { Num } from "../../tree/num/Num";
import { one } from "../../tree/rat/Rat";
import { cons, is_cons, is_nil, U } from "../../tree/tree";
import { canonicalize_mul } from "../canonicalize/canonicalize_unary_mul";

/**
 * expr = canonical_factor_num_lhs(expr) * canonical_factor_num_rhs(expr)
 */
 export function canonical_factor_num_lhs(expr: U): Num {
    const L0 = expr;
    if (is_cons(L0)) {
        if (is_mul(L0)) {
            const L1 = L0.cdr;
            if (is_nil(L1)) {
                return one;
            }
            else {
                const first = L1.car;
                if (is_num(first)) {
                    return first;
                }
                else {
                    return one;
                }
            }
        }
        else {
            return one;
        }
    }
    else {
        return one;
    }
}

/**
 * expr = canonical_factor_num_lhs(expr) * canonical_factor_num_rhs(expr)
 */
export function canonical_factor_num_rhs(expr: U): U {
    const L0 = expr;
    if (is_cons(L0)) {
        if (is_mul(L0)) {
            const L1 = L0.cdr;
            if (is_nil(L1)) {
                return one;
            }
            else {
                const first = L1.car;
                if (is_num(first)) {
                    const L2 = L1.cdr;
                    return canonicalize_mul(cons(L0.opr, L2));
                }
                else {
                    return L0;
                }
            }
        }
        else {
            return L0;
        }
    }
    else {
        return L0;
    }
}