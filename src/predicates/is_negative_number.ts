import { is_flt } from "../operators/flt/is_flt";
import { is_rat } from "../operators/rat/is_rat";
import { Num } from "../tree/num/Num";
import { U } from "../tree/tree";

/**
 * The expression must be a Rat or Flt, otherwise the return value is false.
 * Returns true if expr < 0.
 * @param expr The expression being tested.
 */
export function is_negative_number(expr: U): expr is Num & { __ts_sign: -1 } {
    if (is_rat(expr)) {
        return expr.isNegative();
    }
    else if (is_flt(expr)) {
        return expr.isNegative();
    }
    else {
        return false;
    }
}