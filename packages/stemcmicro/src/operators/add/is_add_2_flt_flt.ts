import { is_flt } from "math-expression-atoms";
import { Cons } from "math-expression-tree";
import { is_add_2_any_any } from "./is_add_2_any_any";

export function is_add_2_flt_flt(expr: Cons): boolean {
    if (is_add_2_any_any(expr)) {
        const lhs = expr.item(1);
        const rhs = expr.item(2);
        return is_flt(lhs) && is_flt(rhs);
    } else {
        return false;
    }
}
