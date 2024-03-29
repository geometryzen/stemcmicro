import { is_imu } from "../imu/is_imu";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_any } from "./is_mul_2_any_any";

export function is_mul_2_imu_sym(expr: Cons): expr is Cons2<Sym, Cons2<Sym, Rat, Rat>, Sym> {
    return is_mul_2_any_any(expr) && is_imu(expr.lhs) && is_sym(expr.rhs);
}