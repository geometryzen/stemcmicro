import { arcsin } from '../arcsin';
import { ExtensionEnv } from '../env/ExtensionEnv';
import { stack_push } from '../runtime/stack';
import { cadr } from '../tree/helpers';
import { U } from '../tree/tree';

/* arcsin =====================================================================
 
Tags
----
scripting, JS, internal, treenode, general concept
 
Parameters
----------
x
 
General description
-------------------
Returns the inverse sine of x.
 
*/
export function Eval_arcsin(x: U, $: ExtensionEnv): void {
    stack_push(arcsin($.valueOf(cadr(x)), $));
}
