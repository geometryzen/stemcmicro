import { ExtensionEnv } from '../../env/ExtensionEnv';
import { items_to_cons } from '../../makeList';
import { is_flt } from '../flt/is_flt';
import { ARCTANH, TANH } from '../../runtime/constants';
import { create_flt } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { zero } from '../../tree/rat/Rat';
import { car, U } from '../../tree/tree';

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
export function Eval_arctanh(x: U, $: ExtensionEnv): U {
    return arctanh($.valueOf(cadr(x)), $);
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
        return create_flt(d);
    }

    if ($.is_zero(x)) {
        return zero;
    }

    return items_to_cons(ARCTANH, x);
}