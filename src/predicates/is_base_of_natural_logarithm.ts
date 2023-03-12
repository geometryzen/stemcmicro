
import { Native } from "../native/Native";
import { native_sym } from "../native/native_sym";
import { is_num } from "../operators/num/is_num";
import { is_sym } from "../operators/sym/is_sym";
import { is_power } from "../runtime/helpers";
import { Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";

const E = native_sym(Native.E);

/**
 * @param expr The base found in e.g. (expt base exponent).
 */
export function is_base_of_natural_logarithm(expr: U): expr is Sym & { __key: 'math.E' } {
    if (is_sym(expr)) {
        // console.lg("is_base_of_natural_logarithm", expr.toString());
        return E.equals(expr);
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