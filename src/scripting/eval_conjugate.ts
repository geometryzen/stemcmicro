import { clockform } from '../operators/clock/clock';
import { complex_conjugate } from '../complex_conjugate';
import { ExtensionEnv } from '../env/ExtensionEnv';
import { imu } from '../env/imu';
import { polar } from '../operators/polar/polar';
import { stack_push } from '../runtime/stack';
import { cadr } from '../tree/helpers';
import { U } from '../tree/tree';

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
export function Eval_conjugate(expr: U, $: ExtensionEnv): void {
    const p1 = $.valueOf(cadr(expr));
    if (!p1.contains(imu)) {
        // example: (-1)^(1/3)
        stack_push(clockform(complex_conjugate(polar(p1, $), $), $));
    }
    else {
        stack_push(complex_conjugate(p1, $));
    }
}
