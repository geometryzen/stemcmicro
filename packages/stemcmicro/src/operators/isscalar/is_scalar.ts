import { is_flt, is_rat, is_sym } from "@stemcmicro/atoms";
import { is_nil, U } from "@stemcmicro/tree";

export function is_scalar(expr: U): boolean {
    if (is_nil(expr)) {
        return false;
    } else if (is_rat(expr)) {
        return true;
    } else if (is_flt(expr)) {
        return true;
    } else if (is_sym(expr)) {
        return true;
    } else {
        return false;
    }
}
