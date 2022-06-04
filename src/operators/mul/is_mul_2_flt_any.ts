import { Flt } from "../../tree/flt/Flt";
import { is_flt } from "../flt/is_flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_flt_any(expr: Cons): expr is BCons<Sym, Flt, U> {
    return is_mul_2_any_any(expr) && is_flt(expr.lhs);
}