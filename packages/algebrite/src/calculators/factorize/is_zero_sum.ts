import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_num } from "../../operators/num/is_num";
import { Num } from "../../tree/num/Num";
import { is_cons, U } from "../../tree/tree";
import { add_num_num } from "../add/add_num_num";

/**
 * Given expr = lhs + rhs, does it simplify to zero. i.e. do the terms cancel?
 */
export function is_zero_sum(lhs: U, rhs: U, $: ExtensionEnv): boolean {
    if (is_num(lhs) && is_num(rhs)) {
        return is_zero_sum_num_num(lhs, rhs);
    }
    if (is_cons(lhs) && is_mul_2_any_any(lhs)) {
        // (X * Y) + Z
        const X = lhs.lhs;
        const Y = lhs.rhs;
        const Z = rhs;
        if (Y.equals(Z)) {
            // (X * Y) + Y = (X + 1) * Y
            return $.isminusone(X) || $.iszero(Y);
        }
        if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
            // (X * Y) + (Z * W)
            const Z = rhs.lhs;
            const W = rhs.rhs;
            if (Y.equals(W)) {
                // (X * Y) + (Z * Y) = (X + Z) * Y
                return is_zero_sum(X, Z, $) || $.iszero(Y);
            }
        }
    }
    if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
        // X + (Y * Z)
        const X = lhs;
        const Y = rhs.lhs;
        const Z = rhs.rhs;
        if (Z.equals(X)) {
            // X + (Y * X) = (1 + Y) * X
            return $.isminusone(Y) || $.iszero(X);
        }
    }
    return false;
}

function is_zero_sum_num_num(lhs: Num, rhs: Num): boolean {
    // We hope to get an answer without actually creating a new number (object).
    // But for now we use an un-optimized version.
    return add_num_num(lhs, rhs).isZero();
}
