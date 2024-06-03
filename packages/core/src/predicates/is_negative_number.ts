import { is_num, Num } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

/**
 * The expression must be a Rat or Flt, otherwise the return value is false.
 * Returns true if expr < 0.
 * @param expr The expression being tested.
 */
export function is_num_and_negative(expr: U): expr is Num & { __ts_sign: -1 } {
    return is_num(expr) && expr.isNegative();
}
