import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_sym } from "../sym/is_sym";
import { is_pow_2_any_any } from "./is_pow_2_any_any";

export function is_pow_2_sym_any(expr: Cons): expr is BCons<Sym, Sym, U> {
    return is_pow_2_any_any(expr) && is_sym(expr.lhs);
}