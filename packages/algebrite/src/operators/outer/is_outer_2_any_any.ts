import { Sym } from "@stemcmicro/atoms";
import { Cons, Cons2, is_cons2, U } from "@stemcmicro/tree";
import { is_outer } from "./is_outer";

export function is_outer_2_any_any(expr: Cons): expr is Cons2<Sym, U, U> {
    return is_outer(expr) && is_cons2(expr);
}
