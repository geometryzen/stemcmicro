import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_any_cons(expr: Cons): expr is BCons<Sym, U, Cons> {
    return is_mul_2_any_any(expr) && is_cons(expr.rhs);
}