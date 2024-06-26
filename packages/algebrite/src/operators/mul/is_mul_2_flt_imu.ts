import { Rat } from "@stemcmicro/atoms";
import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Cons2 } from "../helpers/Cons2";
import { is_imu } from "../imu/is_imu";

export function is_mul_2_flt_imu(expr: Cons): expr is Cons2<Sym, Flt, Cons2<Sym, Rat, Rat>> {
    return is_mul_2_any_any(expr) && is_flt(expr.lhs) && is_imu(expr.rhs);
}
