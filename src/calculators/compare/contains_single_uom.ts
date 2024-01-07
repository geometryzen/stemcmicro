import { is_uom } from "math-expression-atoms";
import { is_cons_opr_eq_mul } from "../../operators/mul/is_cons_opr_eq_mul";
import { is_cons, U } from "../../tree/tree";
import { count_factors } from "../count_factors";

export function contains_single_uom(expr: U): boolean {
    if (is_uom(expr)) {
        return true;
    }
    else if (is_cons(expr) && is_cons_opr_eq_mul(expr) && count_factors(expr, is_uom) === 1) {
        return true;
    }
    else {
        return false;
    }
}
