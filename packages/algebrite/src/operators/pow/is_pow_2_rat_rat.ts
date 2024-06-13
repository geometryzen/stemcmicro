import { is_rat, Rat, Sym } from "@stemcmicro/atoms";
import { Cons, Cons2 } from "@stemcmicro/tree";
import { is_pow_2_any_any } from "./is_pow_2_any_any";

export function is_pow_2_rat_rat(expr: Cons): expr is Cons2<Sym, Rat, Rat> {
    return is_pow_2_any_any(expr) && is_rat(expr.lhs) && is_rat(expr.rhs);
}
