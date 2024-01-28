import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_sym } from "../sym/is_sym";
import { is_pow_2_any_any } from "./is_pow_2_any_any";

export function is_pow_2_sym_any(expr: Cons): expr is Cons2<Sym, Sym, U> {
    return is_pow_2_any_any(expr) && is_sym(expr.lhs);
}