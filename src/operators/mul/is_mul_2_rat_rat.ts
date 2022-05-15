import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_rat_rat(expr: Cons): expr is BCons<Sym, Rat, Rat> {
    return is_mul_2_any_any(expr) && is_rat(expr.lhs) && is_rat(expr.rhs);
}