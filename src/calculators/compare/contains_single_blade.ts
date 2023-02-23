import { is_blade } from "../../operators/blade/is_blade";
import { is_cons_opr_eq_mul } from "../../operators/mul/is_cons_opr_eq_mul";
import { is_cons, U } from "../../tree/tree";
import { count_factors } from "../count_factors";

export function contains_single_blade(expr: U): boolean {
    if (is_blade(expr)) {
        return true;
    }
    else if (is_cons(expr) && is_cons_opr_eq_mul(expr) && count_factors(expr, is_blade) === 1) {
        return true;
    }
    else {
        return false;
    }
}
