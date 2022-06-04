import { MATH_POW } from "../runtime/ns_math";
import { is_flt } from "../operators/flt/is_flt";
import { is_rat } from "../operators/rat/is_rat";
import { negOne } from "../tree/rat/Rat";
import { items_to_cons, U } from "../tree/tree";

export function inverse(expr: U): U {
    if (is_rat(expr)) {
        return expr.inv();
    }
    else if (is_flt(expr)) {
        return expr.inv();
    }
    else {
        return items_to_cons(MATH_POW.clone(expr.pos, expr.end), expr, negOne);
    }
}