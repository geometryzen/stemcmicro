
import { is_sym } from "../operators/sym/is_sym";
import { MATH_E } from "../runtime/ns_math";
import { U } from "../tree/tree";

/**
 * @param base The base found in e.g. (power base exponent).
 */
export function is_base_of_natural_logarithm(base: U): boolean {
    if (is_sym(base)) {
        return MATH_E.equals(base);
    }
    else {
        return false;
    }
}