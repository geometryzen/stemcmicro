import { is_blade } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";

/**
 * Left Contraction (<<)
 *
 * @param lhs The left hand side operand.
 * @param rhs The right hand side operand.
 * @returns lhs << rhs
 */
export function lco(lhs: U, rhs: U): U {
    if (is_blade(lhs)) {
        if (is_blade(rhs)) {
            return lhs.lshift(rhs);
        } else {
            throw new Error(`${lhs},${rhs}`);
        }
    } else {
        // TODO: It is possible to raise an error and it gets lost. How come?
        throw new Error(`${lhs},${rhs}`);
    }
}
