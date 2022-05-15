import { ExtensionEnv } from './env/ExtensionEnv';
import { is_negative_term } from './is';
import { makeList } from './makeList';
import { nativeInt } from './nativeInt';
import { BESSELY } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { flt } from './tree/flt/Flt';
import { is_flt } from './tree/flt/is_flt';
import { caddr, cadr } from './tree/helpers';
import { negOne } from './tree/rat/Rat';
import { U } from './tree/tree';

/* bessely =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x,n

General description
-------------------

Bessel function of second kind.

*/
export function Eval_bessely(p1: U, $: ExtensionEnv): void {
    const result = bessely($.valueOf(cadr(p1)), $.valueOf(caddr(p1)), $);
    stack_push(result);
}

export function bessely(p1: U, p2: U, $: ExtensionEnv): U {
    return yybessely(p1, p2, $);
}

function yybessely(X: U, N: U, $: ExtensionEnv): U {
    const n = nativeInt(N);

    if (is_flt(X) && !isNaN(n)) {
        const d = yn(n, X.d);
        return flt(d);
    }

    if (is_negative_term(N)) {
        return $.multiply($.power(negOne, N), makeList(BESSELY, X, $.negate(N)));
    }

    return makeList(BESSELY, X, N);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function yn(n: number, x: number): number {
    throw new Error('Not implemented');
    // See https://git.musl-libc.org/cgit/musl/tree/src/math/jn.c
    // https://github.com/SheetJS/bessel
}
