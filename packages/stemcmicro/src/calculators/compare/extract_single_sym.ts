import { is_sym, Sym } from "math-expression-atoms";
import { is_cons, U } from "math-expression-tree";
import { is_cons_opr_eq_mul } from "../../operators/mul/is_cons_opr_eq_mul";
import { count_factors } from "../count_factors";
import { remove_factors } from "../remove_factors";
import { not_is_sym } from "./not_is_sym";

export function extract_single_sym(expr: U): Sym {
    if (is_sym(expr)) {
        return expr;
    } else if (is_cons(expr) && is_cons_opr_eq_mul(expr) && count_factors(expr, is_sym) === 1) {
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
