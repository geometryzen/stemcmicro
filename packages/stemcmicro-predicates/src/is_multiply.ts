import { Cons, is_cons, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_multiply } from "./is_cons_opr_eq_multiply";

export function is_multiply(expr: U): expr is Cons & { __ts_sym: "*" } {
    return is_cons(expr) && is_cons_opr_eq_multiply(expr);
}
