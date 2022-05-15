import { arccos } from '../arccos';
import { ExtensionEnv } from '../env/ExtensionEnv';
import { stack_push } from '../runtime/stack';
import { cadr } from '../tree/helpers';
import { U } from '../tree/tree';

/* arccos =====================================================================
 
Tags
----
scripting, JS, internal, treenode, general concept
 
Parameters
----------
x
 
General description
-------------------
Returns the inverse cosine of x.
 
*/
export function Eval_arccos(x: U, $: ExtensionEnv): void {
    stack_push(arccos($.valueOf(cadr(x)), $));
}
