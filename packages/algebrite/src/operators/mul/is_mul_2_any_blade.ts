import { Blade, is_blade, Sym } from "@stemcmicro/atoms";
import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Cons, Cons2, U } from "@stemcmicro/tree";

export function is_mul_2_any_blade(expr: Cons): expr is Cons2<Sym, U, Blade> {
    return is_mul_2_any_any(expr) && is_blade(expr.rhs);
}
