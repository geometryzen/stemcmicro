import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { ARCCOSH, COSH } from './runtime/constants';
import { halt } from './runtime/defs';
import { stack_push } from './runtime/stack';
import { flt } from './tree/flt/Flt';
import { is_flt } from './tree/flt/is_flt';
import { cadr } from './tree/helpers';
import { zero } from './tree/rat/Rat';
import { car, U } from './tree/tree';

/* arccosh =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse hyperbolic cosine of x.

*/
export function Eval_arccosh(x: U, $: ExtensionEnv): void {
    stack_push(arccosh($.valueOf(cadr(x)), $));
}

function arccosh(x: U, $: ExtensionEnv): U {
    if (car(x).equals(COSH)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        let { d } = x;
        if (d < 1.0) {
            halt('arccosh function argument is less than 1.0');
        }
        d = Math.log(d + Math.sqrt(d * d - 1.0));
        return flt(d);
    }

    if ($.isOne(x)) {
        return zero;
    }

    return makeList(ARCCOSH, x);
}
