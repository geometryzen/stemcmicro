import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

export function is_add_2_any_any(expr: Cons): expr is Cons2<Sym, U, U> {
    return is_opr_2_any_any(MATH_ADD)(expr);
}
