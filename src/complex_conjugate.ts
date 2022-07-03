
import { imu } from './env/imu';
import { ExtensionEnv } from './env/ExtensionEnv';
import { subst } from './operators/subst/subst';
import { U } from './tree/tree';

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

// careful is you pass this one an expression with
// i (instead of (-1)^(1/2)) then this doesn't work!
export function complex_conjugate(expr: U, $: ExtensionEnv): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, where: string): U {
        // console.lg(`conj of ${$.toInfixString(z)} => ${$.toInfixString(retval)} (${where})`);
        return retval;
    };

    // console.lg(`i => ${$.toInfixString(i)}`);
    const minus_i = $.negate(imu);
    // console.lg(`minus_i => ${$.toInfixString(minus_i)}`);
    // console.lg(`z => ${$.toInfixString(expr)}`);
    const z_star = subst(expr, imu, minus_i, $);
    // console.lg(`z_star => ${$.toInfixString(z_star)}`);
    return hook($.valueOf(z_star), "");
}
