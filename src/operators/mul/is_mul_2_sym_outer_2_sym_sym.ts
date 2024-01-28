import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_outer_2_sym_sym } from "../outer/is_outer_2_sym_sym";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_sym_outer_2_sym_sym(expr: Cons): expr is Cons2<Sym, Sym, Cons2<Sym, Sym, Sym>> {
    return is_mul_2_any_any(expr) && is_sym(expr.lhs) && is_cons(expr.rhs) && is_outer_2_sym_sym(expr.rhs);
}