import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";

export function is_mul_2_any_cons(expr: Cons): expr is Cons2<Sym, U, Cons> {
    return is_mul_2_any_any(expr) && is_cons(expr.rhs);
}
