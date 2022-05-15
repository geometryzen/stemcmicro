import { is_imu } from "../../predicates/is_imu";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_imu_sym(expr: Cons): expr is BCons<Sym, BCons<Sym, Rat, Rat>, Sym> {
    return is_mul_2_any_any(expr) && is_imu(expr.lhs) && is_sym(expr.rhs);
}