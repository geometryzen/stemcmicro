import { MATH_MUL } from "../runtime/ns_math";
import { is_flt } from "../tree/flt/is_flt";
import { is_rat } from "../tree/rat/is_rat";
import { negOne } from "../tree/rat/Rat";
import { makeList, U } from "../tree/tree";

export function scanner_negate(expr: U): U {
    if (is_rat(expr)) {
        return expr.neg();
    }
    else if (is_flt(expr)) {
        return expr.neg();
    }
    else {
        // The ordering of -1 and expr is not important, but this order will likely reduce downstream processing.
        return makeList(MATH_MUL.clone(expr.pos, expr.end), negOne, expr);
    }
}
