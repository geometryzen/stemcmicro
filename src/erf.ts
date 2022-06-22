import { ExtensionEnv } from './env/ExtensionEnv';
import { erfc } from './erfc';
import { makeList } from './makeList';
import { is_flt } from './operators/flt/is_flt';
import { is_negative } from './predicates/is_negative';
import { ERF } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { wrap_as_flt } from './tree/flt/Flt';
import { cadr } from './tree/helpers';
import { zero } from './tree/rat/Rat';
import { U } from './tree/tree';

/* erf =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Authors
-------
philippe.billet@noos.fr

Parameters
----------
x

General description
-------------------
Error function erf(x).
erf(-x)=erf(x)

*/
export function Eval_erf(p1: U, $: ExtensionEnv): void {
    const result = yerf($.valueOf(cadr(p1)), $);
    stack_push(result);
}

function yerf(p1: U, $: ExtensionEnv): U {
    if (is_flt(p1)) {
        return wrap_as_flt(1.0 - erfc(p1.d));
    }

    if ($.isZero(p1)) {
        return zero;
    }

    if (is_negative(p1)) {
        return $.negate(makeList(ERF, $.negate(p1)));
    }

    return makeList(ERF, p1);
}
