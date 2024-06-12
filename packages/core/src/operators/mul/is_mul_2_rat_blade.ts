import { Blade, is_blade, Rat } from "@stemcmicro/atoms";
import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_rat } from "../rat/is_rat";

export function is_mul_2_rat_blade(expr: Cons): expr is Cons2<Sym, Rat, Blade> {
    return is_mul_2_any_any(expr) && is_rat(expr.lhs) && is_blade(expr.rhs);
}
