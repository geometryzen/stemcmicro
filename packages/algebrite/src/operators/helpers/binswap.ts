import { Sym } from "@stemcmicro/atoms";
import { items_to_cons, U } from "@stemcmicro/tree";
import { Cons2 } from "./Cons2";

/**
 * A convenience function for swapping lhs and rhs expressions.
 * The value of the operands are not computed.
 */
export function binswap(expr: Cons2<Sym, U, U>): U {
    return items_to_cons(expr.opr, expr.rhs, expr.lhs);
}
