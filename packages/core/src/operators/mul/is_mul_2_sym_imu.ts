import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { is_imu } from "../imu/is_imu";
import { is_sym } from "../sym/is_sym";

export function is_mul_2_sym_imu(expr: Cons): expr is Cons2<Sym, Sym, Cons2<Sym, Rat, Rat>> {
    return is_mul_2_any_any(expr) && is_sym(expr.lhs) && is_imu(expr.rhs);
}
