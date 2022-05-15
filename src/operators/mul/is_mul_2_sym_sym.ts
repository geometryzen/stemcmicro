import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_sym_sym(expr: Cons): expr is BCons<Sym, Sym, Sym> {
    return is_mul_2_any_any(expr) && is_sym(expr.lhs) && is_sym(expr.rhs);
}