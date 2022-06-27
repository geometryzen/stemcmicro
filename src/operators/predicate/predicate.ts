
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

import { ExtensionEnv } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { ASSIGN, TESTEQ } from "../../runtime/constants";
import { caddr, cadr } from "../../tree/helpers";
import { car, U } from "../../tree/tree";

export function Eval_predicate(p1: U, $: ExtensionEnv): U {
    if (car(p1).equals(ASSIGN)) {
        // replace the assignment in the
        // head with an equality test
        p1 = makeList(TESTEQ), cadr(p1), caddr(p1);
    }

    return $.valueOf(p1);
}
