import { Sym } from "math-expression-atoms";
import { items_to_cons, U } from "math-expression-tree";
import { BCons } from "./BCons";

/**
 * A convenience function for swapping lhs and rhs expressions.
 * The value of the operands are not computed.
 */
export function binswap(expr: BCons<Sym, U, U>): U {
    return items_to_cons(expr.opr, expr.rhs, expr.lhs);
}
