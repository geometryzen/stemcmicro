import { is_flt, is_rat } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { is_safe_integer_range } from "./predicates/is_safe_integer_range";

/**
 * If the expr is not a Rat or Flt then the result is NaN.
 * If the expr is a Rat and an integer and in safe range for EcmaScript number then a number is returned.
 * If the expr is a Flt and an integer then the number is returned.
 */
export function num_to_number(expr: U): number {
    if (is_rat(expr)) {
        if (expr.isInteger() && is_safe_integer_range(expr.a)) {
            return expr.a.toJSNumber();
        } else {
            return NaN;
        }
    } else if (is_flt(expr)) {
        if (Math.floor(expr.d) === expr.d) {
            return expr.d;
        } else {
            return NaN;
        }
    } else {
        return NaN;
    }
}
