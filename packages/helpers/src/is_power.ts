import { Sym } from "@stemcmicro/atoms";
import { Cons2, is_cons, U } from "@stemcmicro/tree";
import { is_cons_opr_eq_power } from "./is_cons_opr_eq_power";

/**
 * @deprecated Use is_cons(x) && is_cons_opr_eq_power(x)
 */
export function is_power(x: U): x is Cons2<Sym, U, U> & { __ts_sym: "power" } {
    return is_cons(x) && is_cons_opr_eq_power(x);
}
