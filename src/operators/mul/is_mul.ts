import { MATH_MUL } from "../../runtime/ns_math";
import { Cons } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";

export function is_mul(expr: Cons): expr is Cons {
    const opr = expr.opr;
    if (is_sym(opr)) {
        return MATH_MUL.equalsSym(opr);
    }
    else {
        return false;
    }
}
