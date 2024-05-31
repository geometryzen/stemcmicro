import { is_cons_opr_eq_sym } from "@stemcmicro/predicates";
import { Cons } from "@stemcmicro/tree";
import { MATH_MUL } from "../../runtime/ns_math";

export function is_cons_opr_eq_mul(expr: Cons): expr is Cons {
    return is_cons_opr_eq_sym(expr, MATH_MUL);
}
