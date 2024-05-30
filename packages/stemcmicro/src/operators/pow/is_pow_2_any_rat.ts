import { is_rat, Rat, Sym } from "@stemcmicro/atoms";
import { Cons, Cons2, U } from "@stemcmicro/tree";
import { is_pow_2_any_any } from "./is_pow_2_any_any";

export function is_pow_2_any_rat(expr: Cons): expr is Cons2<Sym, U, Rat> {
    return is_pow_2_any_any(expr) && is_rat(expr.rhs);
}
