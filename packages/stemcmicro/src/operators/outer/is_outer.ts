import { is_sym } from "math-expression-atoms";
import { Cons } from "math-expression-tree";
import { MATH_OUTER } from "../../runtime/ns_math";

export function is_outer(expr: Cons): boolean {
    const opr = expr.opr;
    if (is_sym(opr)) {
        return MATH_OUTER.equalsSym(opr);
    } else {
        return false;
    }
}
