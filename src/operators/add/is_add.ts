import { MATH_ADD } from "../../runtime/ns_math";
import { Cons } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";

export function is_add(expr: Cons): expr is Cons {
    const opr = expr.opr;
    if (is_sym(opr)) {
        return MATH_ADD.equalsSym(opr);
    }
    else {
        return false;
    }
}
