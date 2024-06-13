import { is_rat } from "@stemcmicro/atoms";
import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Cons } from "../../tree/tree";

export function is_mul_2_rat_zero_any(expr: Cons): boolean {
    if (is_mul_2_any_any(expr)) {
        const lhs = expr.lhs;
        return is_rat(lhs) && lhs.isZero();
    }
    return false;
}
