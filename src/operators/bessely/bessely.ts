import { create_flt, is_flt, negOne } from 'math-expression-atoms';
import { Cons, items_to_cons, U } from 'math-expression-tree';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { nativeInt } from '../../nativeInt';
import { is_negative } from '../../predicates/is_negative';
import { BESSELY } from '../../runtime/constants';
import { caddr, cadr } from '../../tree/helpers';

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
export function eval_bessely(p1: Cons, $: ExtensionEnv): U {
    return bessely($.valueOf(cadr(p1)), $.valueOf(caddr(p1)), $);
}

export function bessely(p1: U, p2: U, $: ExtensionEnv): U {
    return yybessely(p1, p2, $);
}

function yybessely(X: U, N: U, $: ExtensionEnv): U {
    const n = nativeInt(N);

    if (is_flt(X) && !isNaN(n)) {
        const d = yn(n, X.d);
        return create_flt(d);
    }

    if (is_negative(N)) {
        return $.multiply($.power(negOne, N), items_to_cons(BESSELY, X, $.negate(N)));
    }

    return items_to_cons(BESSELY, X, N);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function yn(n: number, x: number): number {
    throw new Error('Not implemented');
    // See https://git.musl-libc.org/cgit/musl/tree/src/math/jn.c
    // https://github.com/SheetJS/bessel
}
