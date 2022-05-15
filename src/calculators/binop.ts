import { ExtensionEnv } from "../env/ExtensionEnv";
import { value_of } from "../operators/helpers/valueOf";
import { makeList, U } from "../tree/tree";

/**
 * A convenience function for creating binary expressions.
 * 1. Computes the value of lhs and rhs.
 * 2. Combines opr, lhs, and rhs into a (Cons) list.
 * 3. Computes the value of the list.
 * @param opr The symbol in the position of the zeroth element of the list. 
 * @param lhs The expression in the first element of the list.
 * @param rhs The expression in the second element of the list.
 */
export function binop(opr: U, lhs: U, rhs: U, $: ExtensionEnv): U {
    const A = value_of(lhs, $);
    const B = value_of(rhs, $);
    const C = makeList(opr, A, B);
    const D = value_of(C, $);
    return D;
}
