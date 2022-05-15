import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_any_sym(expr: Cons): expr is BCons<Sym, U, Sym> {
    return is_mul_2_any_any(expr) && is_sym(expr.rhs);
}