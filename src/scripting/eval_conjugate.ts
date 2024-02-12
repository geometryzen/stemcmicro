import { complex_conjugate } from '../complex_conjugate';
import { ExtensionEnv } from '../env/ExtensionEnv';
import { imu } from '../env/imu';
import { stack_push } from '../runtime/stack';
import { cadr } from '../tree/helpers';
import { Cons } from '../tree/tree';

/* conj =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
z

General description
-------------------
Returns the complex conjugate of z.

*/
export function eval_conjugate(expr: Cons, $: ExtensionEnv): void {
    const z = $.valueOf(cadr(expr));
    if (!z.contains(imu)) {
        // example: (-1)^(1/3)
        stack_push($.clock(complex_conjugate($.polar(z), $)));
    }
    else {
        stack_push(complex_conjugate(z, $));
    }
}
