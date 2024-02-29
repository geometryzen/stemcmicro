import { is_flt, is_rat, negOne } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { items_to_cons, U } from "math-expression-tree";
import { diagnostic } from "../diagnostics/diagnostics";
import { Diagnostics } from "../diagnostics/messages";

/**
 * Constructs the combination (divide 1 expr) without any further evaluation, which is why there is no expression context.
 * Owing to the way that parsing is done, the user may not have explicitly entered a one in some numerator position.
 * As a consequence, errors reported from this function should really only report division by zero being undefined.
 */
export function one_divided_by(expr: U): U {
    if (is_rat(expr)) {
        if (expr.isZero()) {
            // We could probably get the position here, but it would need to be made absolute.
            return diagnostic(Diagnostics.Division_by_zero);
        }
        else {
            return expr.inv();
        }
    }
    else if (is_flt(expr)) {
        if (expr.isZero()) {
            // We could probably get the position here, but it would need to be made absolute.
            return diagnostic(Diagnostics.Division_by_zero);
        }
        else {
            return expr.inv();
        }
    }
    else {
        return items_to_cons(native_sym(Native.pow).clone(expr.pos, expr.end), expr, negOne);
    }
}