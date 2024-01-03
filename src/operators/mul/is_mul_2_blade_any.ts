import { Blade, is_blade } from "math-expression-atoms";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_blade_any(expr: Cons): expr is BCons<Sym, Blade, U> {
    return is_mul_2_any_any(expr) && is_blade(expr.lhs);
}