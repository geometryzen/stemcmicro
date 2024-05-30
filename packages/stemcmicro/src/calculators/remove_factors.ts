import { is_cons_opr_eq_mul } from "../operators/mul/is_cons_opr_eq_mul";
import { one } from "../tree/rat/Rat";
import { cons, Cons, is_cons, U } from "../tree/tree";
import { canonicalize_mul } from "./canonicalize/canonicalize_mul";

/**
 * Removes factors from a (* f1 f2 f3) or atom that satisfy the predicate.
 * Essentialy returns an expression which is the original with factors removed.
 */
export function remove_factors(expr: U, predicate: (factor: U) => boolean): U {
    if (is_cons(expr)) {
        if (is_cons_opr_eq_mul(expr)) {
            return canonicalize_mul(cons(expr.opr, remove_factors_recursive(expr.argList, predicate)));
        } else {
            return expr;
        }
    } else {
        if (predicate(expr)) {
            return one;
        } else {
            return expr;
        }
    }
}
function remove_factors_recursive(argList: Cons, predicate: (factor: U) => boolean): Cons {
    if (argList.isnil) {
        return argList;
    } else {
        const arg = argList.car;
        if (predicate(arg)) {
            return remove_factors_recursive(argList.argList, predicate);
        } else {
            return cons(arg, remove_factors_recursive(argList.argList, predicate));
        }
    }
}
