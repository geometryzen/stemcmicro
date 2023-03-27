import { U } from "./tree/tree";
import { is_blade } from "./tree/vec/createAlgebra";

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
            return lhs.__lshift__(rhs);
        }
        else {
            throw new Error(`${lhs},${rhs}`);
        }
    }
    else {
        // TODO: It is possible to raise an error and it gets lost. How come?
        throw new Error(`${lhs},${rhs}`);
    }
}