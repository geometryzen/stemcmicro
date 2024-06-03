import { is_sym } from "@stemcmicro/atoms";
import { is_cons_opr_eq_multiply } from "@stemcmicro/predicates";
import { is_cons, U } from "@stemcmicro/tree";
import { count_factors } from "../count_factors";

export function contains_single_sym(expr: U): boolean {
    if (is_sym(expr)) {
        return true;
    } else if (is_cons(expr) && is_cons_opr_eq_multiply(expr) && count_factors(expr, is_sym) === 1) {
        return true;
    } else {
        return false;
    }
}
