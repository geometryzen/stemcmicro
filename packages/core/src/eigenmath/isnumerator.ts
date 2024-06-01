import { is_num, is_rat, is_sym } from "@stemcmicro/atoms";
import { is_native, Native } from "@stemcmicro/native";
import { is_cons, U } from "@stemcmicro/tree";
import { bignum_equal } from "./bignum_equal";

export function isnumerator(expr: U): boolean {
    if (is_cons(expr) && is_sym(expr.opr) && is_native(expr.opr, Native.pow)) {
        const expo = expr.expo;
        if (is_num(expo) && expo.isNegative()) {
            return false;
        }
    }

    if (is_rat(expr) && bignum_equal(expr.a, 1)) {
        return false;
    }

    return true;
}
