import { ExtensionEnv } from "../../env/ExtensionEnv";
import { evaluate_integer } from "../../scripting/evaluate_integer";
import { caddr, cadr, cddr } from "../../tree/helpers";
import { create_int, one } from "../../tree/rat/Rat";
import { Cons, is_cons, U } from "../../tree/tree";
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
export function Eval_dim(dimExpr: Cons, $: ExtensionEnv): U {
    const m = $.valueOf(cadr(dimExpr));
    const n = is_cons(cddr(dimExpr)) ? evaluate_integer(caddr(dimExpr), $) : 1;
    if (!is_tensor(m)) {
        return one; // dim of scalar is 1
    }
    else if (n < 1 || n > m.ndim) {
        return dimExpr;
    }
    else {
        return create_int(m.dim(n - 1));
    }
}
