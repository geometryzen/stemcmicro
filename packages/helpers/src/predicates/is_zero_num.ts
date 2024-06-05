import { is_flt, is_rat, Num } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

/**
 * Determines whether x is zero, if the value is a rational or double.
 * Otherwise, returns false.
 * @param x The value being tested.
 */
export function is_zero_num(x: U): x is Num & { isZero: true } {
    if (is_rat(x)) {
        return x.isZero();
    } else if (is_flt(x)) {
        return x.isZero();
    } else {
        return false;
    }
}
