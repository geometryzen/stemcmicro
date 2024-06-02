import { is_rat } from "@stemcmicro/atoms";
import { Rat } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

/**
 * is_rat(expr) && expr.isInteger
 */
export function is_rat_and_integer(expr: U): expr is Rat & { isInteger: true } {
    return is_rat(expr) && expr.isInteger();
}
