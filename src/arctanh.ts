import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { ARCTANH, TANH } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { flt } from './tree/flt/Flt';
import { is_flt } from './tree/flt/is_flt';
import { cadr } from './tree/helpers';
import { zero } from './tree/rat/Rat';
import { car, U } from './tree/tree';

/* arctanh =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse hyperbolic tangent of x.

*/
export function Eval_arctanh(x: U, $: ExtensionEnv): void {
    stack_push(arctanh($.valueOf(cadr(x)), $));
}

function arctanh(x: U, $: ExtensionEnv): U {
    if (car(x).equals(TANH)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        let { d } = x;
        if (d < -1.0 || d > 1.0) {
            throw new Error('arctanh function argument is not in the interval [-1,1]');
        }
        d = Math.log((1.0 + d) / (1.0 - d)) / 2.0;
        return flt(d);
    }

    if ($.isZero(x)) {
        return zero;
    }

    return makeList(ARCTANH, x);
}
