import { is_opr_2_any_any } from "@stemcmicro/helpers";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";

export function is_add_2_any_any(expr: Cons): expr is Cons2<Sym, U, U> {
    return is_opr_2_any_any(MATH_ADD)(expr);
}
