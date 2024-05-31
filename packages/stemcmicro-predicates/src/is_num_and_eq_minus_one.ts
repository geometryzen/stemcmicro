import { is_num, Num } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

/**
 *
 */
export function is_num_and_eq_minus_one(p: U): p is Num & { __ts_sign: -1; __ts_integer: true; __ts_special: -1 } {
    if (is_num(p)) {
        return p.isMinusOne();
    } else {
        return false;
    }
}
