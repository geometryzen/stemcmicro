import { Sym } from "@stemcmicro/atoms";
import { Cons2, is_cons, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_power } from "./is_cons_opr_eq_power";

export function is_power(expr: U): expr is Cons2<Sym, U, U> & { __ts_sym: "power" } {
    return is_cons(expr) && is_cons_opr_eq_power(expr);
}
