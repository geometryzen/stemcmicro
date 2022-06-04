import { is_rat } from "./operators/rat/is_rat";
import { Rat } from "./tree/rat/Rat";
import { U } from "./tree/tree";

/**
 * is_rat(expr) && expr.isInteger
 */
export function is_rat_integer(p: U): p is Rat & { __ts_integer: true } {
    // TODO: I wonder if this should include other types?
    return is_rat(p) && p.isInteger();
}
