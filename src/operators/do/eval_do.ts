import { ExtensionEnv } from "../../env/ExtensionEnv";
import { stack_pop, stack_push } from "../../runtime/stack";
import { car, cdr, is_cons, U } from "../../tree/tree";

/* do =====================================================================
 
Tags
----
scripting, JS, internal, treenode, general concept
 
Parameters
----------
a,b,...
 
General description
-------------------
Evaluates each argument from left to right. Returns the result of the last argument.
 
*/
export function Eval_do(p1: U, $: ExtensionEnv): U {
    stack_push(car(p1));
    p1 = cdr(p1);

    while (is_cons(p1)) {
        stack_pop();
        stack_push($.valueOf(car(p1)));
        p1 = cdr(p1);
    }

    const retval = stack_pop();
    return retval;
}
