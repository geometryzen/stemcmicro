import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_rat_any(expr: Cons): expr is BCons<Sym, Rat, U> {
    return is_mul_2_any_any(expr) && is_rat(expr.lhs);
}