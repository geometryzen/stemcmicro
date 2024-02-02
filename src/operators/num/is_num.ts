import { is_flt, is_rat, Num } from "math-expression-atoms";
import { U } from "math-expression-tree";

/**
 * Determines whether an atom belongs to the class of numbers.
 * Numbers in this context are things that are treated similarly because they can calculate.
 * e.g. We could introduce an Int type, which would have to be classed as a Num.
 * @param expr The value being tested.
 * @returns true iff x is a Flt or a Rat.
 */
export function is_num(expr: U): expr is Num {
    return is_flt(expr) || is_rat(expr);
}
