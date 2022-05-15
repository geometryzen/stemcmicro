import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

export function is_add_2_any_any(expr: Cons): expr is BCons<Sym, U, U> {
    return is_opr_2_any_any(MATH_ADD)(expr);
}
