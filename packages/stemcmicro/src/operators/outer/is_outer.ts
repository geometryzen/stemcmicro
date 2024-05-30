import { is_sym } from "@stemcmicro/atoms";
import { Cons } from "@stemcmicro/tree";
import { MATH_OUTER } from "../../runtime/ns_math";

export function is_outer(expr: Cons): boolean {
    const opr = expr.opr;
    if (is_sym(opr)) {
        return MATH_OUTER.equalsSym(opr);
    } else {
        return false;
    }
}
