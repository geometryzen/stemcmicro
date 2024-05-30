import { is_flt, is_rat, negOne } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { items_to_cons, U } from "@stemcmicro/tree";

export const MULTIPLY = native_sym(Native.multiply);

export function scanner_negate(expr: U): U {
    if (is_rat(expr)) {
        return expr.neg();
    } else if (is_flt(expr)) {
        return expr.neg();
    } else {
        // The ordering of -1 and expr is not important, but this order will likely reduce downstream processing.
        return items_to_cons(MULTIPLY.clone(expr.pos, expr.end), negOne, expr);
    }
}
