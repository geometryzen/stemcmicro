import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_rat_sym(expr: Cons): expr is BCons<Sym, Rat, Sym> {
    return is_mul_2_any_any(expr) && is_rat(expr.lhs) && is_sym(expr.rhs);
}