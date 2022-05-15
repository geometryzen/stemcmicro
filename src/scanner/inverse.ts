import { MATH_POW } from "../runtime/ns_math";
import { is_flt } from "../tree/flt/is_flt";
import { is_rat } from "../tree/rat/is_rat";
import { negOne } from "../tree/rat/Rat";
import { makeList, U } from "../tree/tree";

export function inverse(expr: U): U {
    if (is_rat(expr)) {
        return expr.inv();
    }
    else if (is_flt(expr)) {
        return expr.inv();
    }
    else {
        return makeList(MATH_POW.clone(expr.pos, expr.end), expr, negOne);
    }
}