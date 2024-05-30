import { Flt } from "../../tree/flt/Flt";
import { is_flt } from "../flt/is_flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_flt_sym(expr: Cons): expr is Cons2<Sym, Flt, Sym> {
    return is_mul_2_any_any(expr) && is_flt(expr.lhs) && is_sym(expr.rhs);
}
