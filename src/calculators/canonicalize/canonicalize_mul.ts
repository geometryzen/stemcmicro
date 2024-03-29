import { one } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { is_cons_opr_eq_mul } from "../../operators/mul/is_cons_opr_eq_mul";

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
        if (L1.isnil) {
            return one;
        }
        else if (L1.cdr.isnil) {
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