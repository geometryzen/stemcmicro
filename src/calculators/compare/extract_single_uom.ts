import { is_uom, Uom } from "math-expression-atoms";
import { is_cons, U } from "math-expression-tree";
import { is_cons_opr_eq_mul } from "../../operators/mul/is_cons_opr_eq_mul";
import { count_factors } from "../count_factors";
import { remove_factors } from "../remove_factors";
import { not_is_uom } from "./not_is_uom";

export function extract_single_uom(expr: U): Uom {
    if (is_uom(expr)) {
        return expr;
    }
    else if (is_cons(expr) && is_cons_opr_eq_mul(expr) && count_factors(expr, is_uom) === 1) {
        const candidate = remove_factors(expr, not_is_uom);
        if (is_uom(candidate)) {
            return candidate;
        }
        else {
            throw new Error();
        }
    }
    else {
        throw new Error();
    }
}
