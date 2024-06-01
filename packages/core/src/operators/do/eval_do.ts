import { ExtensionEnv } from "../../env/ExtensionEnv";
import { car, cdr, Cons, is_cons, U } from "../../tree/tree";

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
export function eval_do(expr: Cons, $: ExtensionEnv): U {
    let result = car(expr);
    let p1 = cdr(expr);

    while (is_cons(p1)) {
        result = $.valueOf(car(p1));
        p1 = cdr(p1);
    }
    return result;
}
