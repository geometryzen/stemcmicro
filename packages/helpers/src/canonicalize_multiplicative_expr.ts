import { one } from "@stemcmicro/atoms";
import { Cons, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_multiply } from "./is_cons_opr_eq_multiply";

/**
 * Converts 0-ary and 1-ary multiplicative expressions to canonical form.
 *
 * 0-ary: (*)   => 1,
 *
 * 1-ary: (* x) => x,
 *
 * otherwise unchanged.
 */
export function canonicalize_multiplicative_expr(expr: Cons): U {
    if (is_cons_opr_eq_multiply(expr)) {
        const argList = expr.cdr;
        try {
            if (argList.isnil) {
                return one;
            } else {
                const rest = argList.rest;
                try {
                    if (rest.isnil) {
                        return argList.car;
                    } else {
                        expr.addRef();
                        return expr;
                    }
                } finally {
                    rest.release();
                }
            }
        } finally {
            argList.release();
        }
    } else {
        expr.addRef();
        return expr;
    }
}
