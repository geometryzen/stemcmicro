import { is_num } from "../operators/num/is_num";
import { Num } from "../tree/num/Num";
import { U } from "../tree/tree";

/**
 * The expression must be a Rat or Flt, otherwise the return value is false.
 * Returns true if expr < 0.
 * @param expr The expression being tested.
 */
export function is_num_and_negative(expr: U): expr is Num & { __ts_sign: -1 } {
    return is_num(expr) && expr.isNegative();
}
