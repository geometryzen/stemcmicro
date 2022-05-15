import { is_mul_2_any_any } from "../../operators/mul/is_mul_2_any_any";
import { is_num } from "../../predicates/is_num";
import { is_cons, U } from "../../tree/tree";

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
