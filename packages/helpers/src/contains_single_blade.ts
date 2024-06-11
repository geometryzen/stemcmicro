import { is_blade } from "@stemcmicro/atoms";
import { count_factors } from "./count_factors";
import { is_cons, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_multiply } from "./is_cons_opr_eq_multiply";

export function contains_single_blade(expr: U): boolean {
    if (is_blade(expr)) {
        return true;
    } else if (is_cons(expr) && is_cons_opr_eq_multiply(expr) && count_factors(expr, is_blade) === 1) {
        return true;
    } else {
        return false;
    }
}
