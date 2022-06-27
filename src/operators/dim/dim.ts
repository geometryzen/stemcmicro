import { ExtensionEnv } from "../../env/ExtensionEnv";
import { evaluate_integer } from "../../scripting/evaluate_integer";
import { caddr, cadr, cddr } from "../../tree/helpers";
import { one, wrap_as_int } from "../../tree/rat/Rat";
import { is_cons, U } from "../../tree/tree";
import { is_tensor } from "../tensor/is_tensor";

/* dim =====================================================================
 
Tags
----
scripting, JS, internal, treenode, general concept
 
Parameters
----------
m,n
 
General description
-------------------
Returns the cardinality of the nth index of tensor "m".
 
*/
export function Eval_dim(p1: U, $: ExtensionEnv): U {
    //int n
    const p2 = $.valueOf(cadr(p1));
    const n = is_cons(cddr(p1)) ? evaluate_integer(caddr(p1), $) : 1;
    if (!is_tensor(p2)) {
        return one; // dim of scalar is 1
    }
    else if (n < 1 || n > p2.rank) {
        return p1;
    }
    else {
        return wrap_as_int(p2.dim(n - 1));
    }
}
