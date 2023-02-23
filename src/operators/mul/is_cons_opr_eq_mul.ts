import { is_cons_opr_eq_sym } from "../../predicates/is_cons_opr_eq_sym";
import { MATH_MUL } from "../../runtime/ns_math";
import { Cons } from "../../tree/tree";

export function is_cons_opr_eq_mul(expr: Cons): expr is Cons {
    return is_cons_opr_eq_sym(expr, MATH_MUL);
}
