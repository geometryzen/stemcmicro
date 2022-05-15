import { Sym } from "../../tree/sym/Sym";
import { makeList, U } from "../../tree/tree";
import { BCons } from "./BCons";

/**
 * A convenience function for swapping lhs and rhs expressions.
 * The value of the operands are not computed.
 */
export function binswap(expr: BCons<Sym, U, U>): U {
    return makeList(expr.opr, expr.rhs, expr.lhs);
}
