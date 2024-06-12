import { is_rat, Rat, Sym } from "@stemcmicro/atoms";
import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Cons, Cons2, U } from "@stemcmicro/tree";

export function is_mul_2_rat_any(expr: Cons): expr is Cons2<Sym, Rat, U> {
    return is_mul_2_any_any(expr) && is_rat(expr.lhs);
}
