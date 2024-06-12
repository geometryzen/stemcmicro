import { is_num, is_sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { is_cons, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_power } from "./is_cons_opr_eq_power";

const MATH_E = native_sym(Native.E);

/**
 * @param x The base found in e.g. (pow base exponent).
 */
export function is_base_of_natural_logarithm(x: U): boolean {
    if (is_sym(x)) {
        return MATH_E.equalsSym(x);
    } else if (is_cons(x) && is_cons_opr_eq_power(x)) {
        const base = x.base;
        const expo = x.expo;
        if (is_num(expo) && expo.isOne()) {
            return is_base_of_natural_logarithm(base);
        } else {
            return false;
        }
    } else {
        return false;
    }
}
