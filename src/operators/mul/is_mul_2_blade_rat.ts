import { Blade, is_blade, is_rat } from "math-expression-atoms";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_blade_rat(expr: Cons): expr is Cons2<Sym, Blade, Rat> {
    return is_mul_2_any_any(expr) && is_blade(expr.lhs) && is_rat(expr.rhs);
}