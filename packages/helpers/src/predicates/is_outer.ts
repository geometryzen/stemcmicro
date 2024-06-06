import { Cons, is_cons, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_outer } from "./is_cons_opr_eq_outer";

export function is_outer(expr: U): expr is Cons & { __ts_sym: "outer" } {
    return is_cons(expr) && is_cons_opr_eq_outer(expr);
}
