import { MATH_INNER } from "../../runtime/ns_math";
import { Cons } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";

export function is_inner(expr: Cons): boolean {
    const opr = expr.opr;
    if (is_sym(opr)) {
        return MATH_INNER.equalsSym(opr);
    } else {
        return false;
    }
}
