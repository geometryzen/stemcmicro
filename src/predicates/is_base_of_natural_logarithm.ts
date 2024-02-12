
import { create_sym, is_num, is_sym, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { U } from "math-expression-tree";
import { is_power } from "../runtime/helpers";

const MATH_E = native_sym(Native.E);
/**
 * Used by Eigenmath
 */
const DOLLAR_E = create_sym("$e");

/**
 * @param expr The base found in e.g. (pow base exponent).
 */
export function is_base_of_natural_logarithm(expr: U): expr is Sym & { __key: 'math.E' } {
    if (is_sym(expr)) {
        // console.lg("is_base_of_natural_logarithm", expr.toString());
        return (MATH_E.equals(expr) || DOLLAR_E.equals(expr));
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