import { U } from "math-expression-tree";
import { Flt, is_flt } from "../flt/Flt";
import { is_rat, Rat } from "../rat/Rat";

/**
 * The Num type is the union of Flt and Rat (and maybe Int in future).
 * While the concept of a number in mathematics may be quite general, in this case we mean the
 * set of things that we can calculate with. Not surprisingly, these need to be treated as a
 * combined entity so that simlifications can be performed.
 */
export type Num = Flt | Rat;

export function is_num(expr: U): expr is Num {
    return is_flt(expr) || is_rat(expr);
}

export function assert_num(expr: U): Num {
    if (is_num(expr)) {
        return expr;
    } else {
        throw new Error(`Expecting a Num but got expression ${expr}.`);
    }
}
