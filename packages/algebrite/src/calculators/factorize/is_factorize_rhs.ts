import { is_num } from "@stemcmicro/atoms";
import { is_mul_2_any_any } from "@stemcmicro/helpers";
import { is_cons, U } from "@stemcmicro/tree";

/**
 * WARNING: Depends on binary multiplication.
 * Determines whether two expressions have a common factor on the right.
 * @param lhs
 * @param rhs
 * @returns
 */
export function is_factorize_rhs(lhs: U, rhs: U): boolean {
    if (lhs.equals(rhs)) {
        return true;
    }
    if (is_num(lhs) && is_num(rhs)) {
        return true;
    }
    if (is_cons(lhs) && is_mul_2_any_any(lhs)) {
        if (is_num(lhs.lhs) && lhs.rhs.equals(rhs)) {
            return true;
        }
        if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
            if (lhs.rhs.equals(rhs.rhs)) {
                return is_factorize_rhs(lhs.lhs, rhs.lhs);
            }
        }
        if (lhs.rhs.equals(rhs)) {
            return true;
        }
    }
    if (is_cons(rhs) && is_mul_2_any_any(rhs)) {
        if (is_num(rhs.lhs) && rhs.rhs.equals(lhs)) {
            return true;
        }
    }
    return false;
}
