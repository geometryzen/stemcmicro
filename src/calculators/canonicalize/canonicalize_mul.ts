import { is_cons_opr_eq_mul } from "../../operators/mul/is_cons_opr_eq_mul";
import { one } from "../../tree/rat/Rat";
import { Cons, is_nil, U } from "../../tree/tree";

/**
 * Converts 0-ary and 1-ary multiplicative expressions to canonical form.
 * 
 * 0-ary: (*)   => 1,
 * 
 * 1-ary: (* x) => x,
 * 
 * otherwise unchanged.
 */
export function canonicalize_mul(expr: Cons): U {
    const L0 = expr;
    if (is_cons_opr_eq_mul(L0)) {
        const L1 = L0.cdr;
        if (is_nil(L1)) {
            return one;
        }
        else if (is_nil(L1.cdr)) {
            return L1.car;
        }
        else {
            return L0;
        }
    }
    else {
        return L0;
    }
}