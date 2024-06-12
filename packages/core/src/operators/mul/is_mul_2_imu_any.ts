import { Rat } from "@stemcmicro/atoms";
import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_imu } from "../imu/is_imu";

export function is_mul_2_imu_any(expr: Cons): expr is Cons2<Sym, Cons2<Sym, Rat, Rat>, U> {
    return is_mul_2_any_any(expr) && is_imu(expr.lhs);
}
