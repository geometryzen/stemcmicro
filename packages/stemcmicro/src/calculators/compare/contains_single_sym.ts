import { is_sym } from "math-expression-atoms";
import { is_cons, U } from "math-expression-tree";
import { is_cons_opr_eq_mul } from "../../operators/mul/is_cons_opr_eq_mul";
import { count_factors } from "../count_factors";

export function contains_single_sym(expr: U): boolean {
    if (is_sym(expr)) {
        return true;
    } else if (is_cons(expr) && is_cons_opr_eq_mul(expr) && count_factors(expr, is_sym) === 1) {
        return true;
    } else {
        return false;
    }
}
