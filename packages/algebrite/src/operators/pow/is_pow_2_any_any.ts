import { Sym } from "@stemcmicro/atoms";
import { Cons, Cons2, is_cons2, U } from "@stemcmicro/tree";
import { is_pow } from "./is_pow";

export function is_pow_2_any_any(expr: Cons): expr is Cons2<Sym, U, U> {
    return is_pow(expr) && is_cons2(expr);
}
