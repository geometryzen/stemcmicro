import { is_uom } from "@stemcmicro/atoms";
import { is_cons, U } from "@stemcmicro/tree";
import { count_factors } from "./count_factors";
import { is_cons_opr_eq_multiply } from "./is_cons_opr_eq_multiply";

export function contains_single_uom(expr: U): boolean {
    if (is_uom(expr)) {
        return true;
    } else if (is_cons(expr) && is_cons_opr_eq_multiply(expr) && count_factors(expr, is_uom) === 1) {
        return true;
    } else {
        return false;
    }
}
