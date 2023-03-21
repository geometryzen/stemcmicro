import { Native } from "../native/Native";
import { native_sym } from "../native/native_sym";
import { is_flt } from "../operators/flt/is_flt";
import { is_rat } from "../operators/rat/is_rat";
import { MATH_POW } from "../runtime/ns_math";
import { Err } from "../tree/err/Err";
import { oneAsFlt } from "../tree/flt/Flt";
import { negOne, one } from "../tree/rat/Rat";
import { items_to_cons, U } from "../tree/tree";

/**
 * Constructs (divide 1 expr) without any further evaluation.
 */
export function one_divided_by(expr: U): U {
    if (is_rat(expr)) {
        if (expr.isZero()) {
            return new Err(items_to_cons(native_sym(Native.divide), one, expr));
        }
        else {
            return expr.inv();
        }
    }
    else if (is_flt(expr)) {
        if (expr.isZero()) {
            return new Err(items_to_cons(native_sym(Native.divide), oneAsFlt, expr));
        }
        else {
            return expr.inv();
        }
    }
    else {
        return items_to_cons(MATH_POW.clone(expr.pos, expr.end), expr, negOne);
    }
}