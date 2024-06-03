import { Imu, is_imu, one, Rat } from "@stemcmicro/atoms";
import { is_cons_opr_eq_multiply } from "@stemcmicro/predicates";
import { is_cons, U } from "@stemcmicro/tree";
import { canonicalize_mul } from "../canonicalize/canonicalize_mul";

export function canonical_factor_imu_rhs(expr: U): Rat | Imu {
    if (is_imu(expr)) {
        return expr;
    } else if (is_cons(expr) && is_cons_opr_eq_multiply(expr)) {
        expr = canonicalize_mul(expr);
        if (is_cons(expr)) {
            const L0 = expr;
            const factors = L0.tail().reverse();
            if (is_imu(factors[0])) {
                return factors[0];
            } else {
                return one;
            }
        } else {
            return canonical_factor_imu_rhs(expr);
        }
    } else {
        return one;
    }
}
