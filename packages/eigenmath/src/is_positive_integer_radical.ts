import { is_rat } from "@stemcmicro/atoms";
import { is_cons_opr_eq_power } from "@stemcmicro/helpers";
import { is_cons, U } from "@stemcmicro/tree";

/**
 * A radical is a square root, a cube root etc.
 * This test is a little more restructive because we require the base to be a positive integer.
 * Returns true if the expression is a power expression with a positive integer base and fractional exponent.
 */
export function is_positive_integer_radical(expr: U): boolean {
    if (is_cons(expr) && is_cons_opr_eq_power(expr)) {
        const base = expr.base;
        const expo = expr.expo;
        try {
            return is_rat(base) && base.isPositiveInteger() && is_rat(expo) && expo.isFraction();
        } finally {
            base.release();
            expo.release();
        }
    } else {
        return false;
    }
}
