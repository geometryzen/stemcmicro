import { is_imu } from "../../operators/imu/is_imu";
import { is_mul } from "../../operators/mul/is_mul";
import { Imu } from "../../tree/imu/ImaginaryUnit";
import { one, Rat } from "../../tree/rat/Rat";
import { is_cons, U } from "../../tree/tree";
import { canonicalize_mul } from "../canonicalize/canonicalize_unary_mul";

export function canonical_factor_imu_rhs(expr: U): Rat | Imu {
    if (is_imu(expr)) {
        return expr;
    }
    else if (is_cons(expr) && is_mul(expr)) {
        expr = canonicalize_mul(expr);
        if (is_cons(expr)) {
            const L0 = expr;
            const factors = L0.tail().reverse();
            if (is_imu(factors[0])) {
                return factors[0];
            }
            else {
                return one;
            }
        }
        else {
            return canonical_factor_imu_rhs(expr);
        }
    }
    else {
        return one;
    }
}