import { is_imu } from "../imu/is_imu";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_imu_any(expr: Cons): expr is Cons2<Sym, Cons2<Sym, Rat, Rat>, U> {
    return is_mul_2_any_any(expr) && is_imu(expr.lhs);
}