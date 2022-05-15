import { is_num } from "../../predicates/is_num";
import { Num } from "../../tree/num/Num";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_num_any(expr: Cons): expr is BCons<Sym, Num, U> {
    return is_mul_2_any_any(expr) && is_num(expr.lhs);
}