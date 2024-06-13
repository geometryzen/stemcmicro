import { is_rat } from "@stemcmicro/atoms";
import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { Cons } from "@stemcmicro/tree";

export function is_mul_2_any_rat(expr: Cons): boolean {
    return is_mul_2_any_any(expr) && is_rat(expr.rhs);
}
