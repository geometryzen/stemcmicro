import { is_flt, is_rat, negOne } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";
import { diagnostic } from "./diagnostics";
import { Diagnostics } from "./messages";

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
        } else {
            return expr.inv();
        }
    } else if (is_flt(expr)) {
        if (expr.isZero()) {
            // We could probably get the position here, but it would need to be made absolute.
            return diagnostic(Diagnostics.Division_by_zero);
        } else {
            return expr.inv();
        }
    } else {
        return items_to_cons(native_sym(Native.pow).clone(expr.pos, expr.end), expr, negOne);
    }
}
