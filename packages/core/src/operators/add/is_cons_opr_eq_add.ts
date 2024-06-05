import { is_cons_opr_eq_sym } from "@stemcmicro/helpers";
import { MATH_ADD } from "../../runtime/ns_math";
import { Cons } from "../../tree/tree";

export function is_cons_opr_eq_add(expr: Cons): expr is Cons & { __ts_sym: "+" } {
    return is_cons_opr_eq_sym(expr, MATH_ADD);
}
