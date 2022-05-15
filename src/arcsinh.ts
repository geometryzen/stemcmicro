import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { ARCSINH, SINH } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { flt } from './tree/flt/Flt';
import { is_flt } from './tree/flt/is_flt';
import { cadr } from './tree/helpers';
import { zero } from './tree/rat/Rat';
import { car, U } from './tree/tree';

/* arcsinh =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse hyperbolic sine of x.

*/
export function Eval_arcsinh(x: U, $: ExtensionEnv): void {
    stack_push(arcsinh($.valueOf(cadr(x)), $));
}

function arcsinh(x: U, $: ExtensionEnv): U {
    if (car(x).equals(SINH)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        let { d } = x;
        d = Math.log(d + Math.sqrt(d * d + 1.0));
        return flt(d);
    }

    if ($.isZero(x)) {
        return zero;
    }

    return makeList(ARCSINH, x);
}
