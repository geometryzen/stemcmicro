
import { is_num } from "../operators/num/is_num";
import { is_sym } from "../operators/sym/is_sym";
import { is_power } from "../runtime/helpers";
import { MATH_E } from "../runtime/ns_math";
import { Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";

/**
 * @param expr The base found in e.g. (expt base exponent).
 */
export function is_base_of_natural_logarithm(expr: U): expr is Sym & { __key: 'MATH_E' } {
    if (is_sym(expr)) {
        return MATH_E.equals(expr);
    }
    else if (is_power(expr)) {
        const base = expr.lhs;
        const expo = expr.rhs;
        if (is_num(expo) && expo.isOne()) {
            return is_base_of_natural_logarithm(base);
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}