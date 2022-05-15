import { MATH_OUTER } from "../../runtime/ns_math";
import { Cons } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";

export function is_outer(expr: Cons): boolean {
    const opr = expr.opr;
    if (is_sym(opr)) {
        return MATH_OUTER.equalsSym(opr);
    }
    else {
        return false;
    }
}
