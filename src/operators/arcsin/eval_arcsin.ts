import { arcsin } from './arcsin';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { cadr } from '../../tree/helpers';
import { U } from '../../tree/tree';

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
export function eval_arcsin(x: U, $: ExtensionEnv): U {
    return arcsin($.valueOf(cadr(x)), $);
}
