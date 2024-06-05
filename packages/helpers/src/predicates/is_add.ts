import { Cons, is_cons, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_add } from "./is_cons_opr_eq_add";

export function is_add(expr: U): expr is Cons & { __ts_sym: "+" } {
    return is_cons(expr) && is_cons_opr_eq_add(expr);
}
