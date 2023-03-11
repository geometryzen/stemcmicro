import { is_rat } from "./operators/rat/is_rat";
import { IsInteger, Rat } from "./tree/rat/Rat";
import { U } from "./tree/tree";

/**
 * is_rat(expr) && expr.isInteger
 */
export function is_rat_and_integer(expr: U): expr is Rat & IsInteger<true> {
    return is_rat(expr) && expr.isInteger();
}
