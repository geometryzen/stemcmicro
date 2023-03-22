
// like Eval() except "=" (assignment) is treated
// as "==" (equality test)
// This is because
//  * this allows users to be lazy and just
//    use "=" instead of "==" as per more common
//    mathematical notation
//  * in many places we don't expect an assignment
//    e.g. we don't expect to test the zero-ness
//    of an assignment or the truth value of
//    an assignment
// Note that these are questionable assumptions
// as for example in most programming languages one
// can indeed test the value of an assignment (the
// value is just the evaluation of the right side)

import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { ASSIGN } from "../../runtime/constants";
import { is_cons, items_to_cons, U } from "../../tree/tree";

const testeq = native_sym(Native.testeq);

/**
 * Allows users to be lazy and use "=" as a test for equality.
 * There is no evaluation by this function.
 */
export function replace_assign_with_testeq(expr: U): U {
    if (is_cons(expr) && expr.head.equals(ASSIGN)) {
        // replace the assignment in the head with an equality test
        const argList = expr.argList;
        const lhs = argList.head;
        const rhs = argList.cdr.head;
        return items_to_cons(testeq, lhs, rhs);
    }
    else {
        return expr;
    }
}
