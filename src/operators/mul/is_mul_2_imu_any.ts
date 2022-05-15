import { is_imu } from "../../predicates/is_imu";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_imu_any(expr: Cons): expr is BCons<Sym, BCons<Sym, Rat, Rat>, U> {
    return is_mul_2_any_any(expr) && is_imu(expr.lhs);
}