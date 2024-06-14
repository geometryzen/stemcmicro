import { is_sym, Sym } from "@stemcmicro/atoms";
import { is_cons, U } from "@stemcmicro/tree";
import { count_factors } from "./count_factors";
import { is_cons_opr_eq_multiply } from "./is_cons_opr_eq_multiply";
import { not_is_sym } from "./not_is_sym";
import { remove_factors } from "./remove_factors";

export function extract_single_sym(expr: U): Sym {
    if (is_sym(expr)) {
        return expr;
    } else if (is_cons(expr) && is_cons_opr_eq_multiply(expr) && count_factors(expr, is_sym) === 1) {
        const candidate = remove_factors(expr, not_is_sym);
        if (is_sym(candidate)) {
            return candidate;
        } else {
            throw new Error();
        }
    } else {
        throw new Error();
    }
}
