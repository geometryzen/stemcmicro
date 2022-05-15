import { ExtensionEnv } from './env/ExtensionEnv';
import { erfc } from './erfc';
import { is_negative_term } from './is';
import { makeList } from './makeList';
import { ERF } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { flt } from './tree/flt/Flt';
import { is_flt } from './tree/flt/is_flt';
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
        return flt(1.0 - erfc(p1.d));
    }

    if ($.isZero(p1)) {
        return zero;
    }

    if (is_negative_term(p1)) {
        return $.negate(makeList(ERF, $.negate(p1)));
    }

    return makeList(ERF, p1);
}
