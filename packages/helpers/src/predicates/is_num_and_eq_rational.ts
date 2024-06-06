import { is_flt, is_rat } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

// a and b ints
export function is_num_and_eq_rational(expr: U, a: number, b: number): boolean {
    if (is_rat(expr)) {
        return expr.numer().isIntegerNumber(a) && expr.denom().isIntegerNumber(b);
    } else if (is_flt(expr)) {
        return expr.d === a / b;
    } else {
        return false;
    }
}
