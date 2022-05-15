import { is_imu } from "../../predicates/is_imu";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_sym_imu(expr: Cons): expr is BCons<Sym, Sym, BCons<Sym, Rat, Rat>> {
    return is_mul_2_any_any(expr) && is_sym(expr.lhs) && is_imu(expr.rhs);
}