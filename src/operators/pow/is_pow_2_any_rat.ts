import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_pow_2_any_any } from "./is_pow_2_any_any";

export function is_pow_2_any_rat(expr: Cons): expr is Cons2<Sym, U, Rat> {
    return is_pow_2_any_any(expr) && is_rat(expr.rhs);
}