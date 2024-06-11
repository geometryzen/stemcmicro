import { is_num, is_rat } from "@stemcmicro/atoms";
import { is_cons_opr_eq_power } from "@stemcmicro/helpers";
import { caddr, is_cons, U } from "@stemcmicro/tree";
import { bignum_equal } from "./bignum_equal";

export function isdenominator(expr: U): boolean {
    if (is_cons(expr) && is_cons_opr_eq_power(expr)) {
        const expo = caddr(expr);
        if (is_num(expo) && expo.isNegative()) {
            return true;
        }
    }

    if (is_rat(expr) && !bignum_equal(expr.b, 1)) {
        return true;
    }

    return false;
}
