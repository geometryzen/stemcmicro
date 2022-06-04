import { MATH_MUL } from "../runtime/ns_math";
import { is_flt } from "../operators/flt/is_flt";
import { is_rat } from "../operators/rat/is_rat";
import { negOne } from "../tree/rat/Rat";
import { items_to_cons, U } from "../tree/tree";

export function scanner_negate(expr: U): U {
    if (is_rat(expr)) {
        return expr.neg();
    }
    else if (is_flt(expr)) {
        return expr.neg();
    }
    else {
        // The ordering of -1 and expr is not important, but this order will likely reduce downstream processing.
        return items_to_cons(MATH_MUL.clone(expr.pos, expr.end), negOne, expr);
    }
}
