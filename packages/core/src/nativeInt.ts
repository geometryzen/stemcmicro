import { is_flt, is_rat, Num } from "@stemcmicro/atoms";
import { is_rat_and_integer, is_safe_integer_range } from "@stemcmicro/helpers";

export function is_integer_and_in_safe_number_range(num: Num): boolean {
    if (is_rat(num)) {
        if (is_rat_and_integer(num) && is_safe_integer_range(num.a)) {
            return true;
        } else {
            return false;
        }
    } else if (is_flt(num)) {
        if (Math.floor(num.d) === num.d) {
            return true;
        } else {
            return false;
        }
    } else {
        throw new Error();
    }
}
