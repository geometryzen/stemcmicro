import { Blade, is_blade } from "math-expression-atoms";
import { is_cons_opr_eq_mul } from "../../operators/mul/is_cons_opr_eq_mul";
import { is_cons, U } from "../../tree/tree";
import { count_factors } from "../count_factors";
import { remove_factors } from "../remove_factors";
import { not_is_blade } from "./not_is_blade";

export function extract_single_blade(expr: U): Blade {
    if (is_blade(expr)) {
        return expr;
    }
    else if (is_cons(expr) && is_cons_opr_eq_mul(expr) && count_factors(expr, is_blade) === 1) {
        const candidate = remove_factors(expr, not_is_blade);
        if (is_blade(candidate)) {
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
