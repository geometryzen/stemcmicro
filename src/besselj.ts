import { ExtensionEnv } from './env/ExtensionEnv';
import { is_negative_term } from './is';
import { makeList } from './makeList';
import { nativeInt } from './nativeInt';
import { BESSELJ, MEQUAL, MSIGN, PI } from './runtime/constants';
import { defs } from './runtime/defs';
import { stack_push } from './runtime/stack';
import { sine } from './operators/sin/sin';
import { wrap_as_flt } from './tree/flt/Flt';
import { is_flt } from './operators/flt/is_flt';
import { caddr, cadr } from './tree/helpers';
import { is_rat } from './operators/rat/is_rat';
import { half, wrap_as_int, negOne, one, two, zero } from './tree/rat/Rat';
import { U } from './tree/tree';

/* besselj =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x,n

General description
-------------------

Returns a solution to the Bessel differential equation (Bessel function of first kind).

Recurrence relation:

  besselj(x,n) = (2/x) (n-1) besselj(x,n-1) - besselj(x,n-2)

  besselj(x,1/2) = sqrt(2/pi/x) sin(x)

  besselj(x,-1/2) = sqrt(2/pi/x) cos(x)

For negative n, reorder the recurrence relation as:

  besselj(x,n-2) = (2/x) (n-1) besselj(x,n-1) - besselj(x,n)

Substitute n+2 for n to obtain

  besselj(x,n) = (2/x) (n+1) besselj(x,n+1) - besselj(x,n+2)

Examples:

  besselj(x,3/2) = (1/x) besselj(x,1/2) - besselj(x,-1/2)

  besselj(x,-3/2) = -(1/x) besselj(x,-1/2) - besselj(x,1/2)

*/
export function Eval_besselj(p1: U, $: ExtensionEnv): void {
    const result = besselj($.valueOf(cadr(p1)), $.valueOf(caddr(p1)), $);
    stack_push(result);
}

export function besselj(p1: U, p2: U, $: ExtensionEnv): U {
    return yybesselj(p1, p2, $);
}

function yybesselj(X: U, N: U, $: ExtensionEnv): U {
    const n = nativeInt(N);

    // numerical result
    if (is_flt(X) && !isNaN(n)) {
        const d = jn(n, X.d);
        return wrap_as_flt(d);
    }

    // bessej(0,0) = 1
    if ($.isZero(X) && $.isZero(N)) {
        return one;
    }

    // besselj(0,n) = 0
    if ($.isZero(X) && !isNaN(n)) {
        return zero;
    }

    // half arguments
    if (is_rat(N) && MEQUAL(N.b, 2)) {
        // n = 1/2
        if (MEQUAL(N.a, 1)) {
            const twoOverPi = defs.evaluatingAsFloat ? wrap_as_flt(2.0 / Math.PI) : $.divide(two, PI);
            return $.multiply($.power($.divide(twoOverPi, X), half), sine(X, $));
        }

        // n = -1/2
        if (MEQUAL(N.a, -1)) {
            const twoOverPi = defs.evaluatingAsFloat ? wrap_as_flt(2.0 / Math.PI) : $.divide(two, PI);
            return $.multiply($.power($.divide(twoOverPi, X), half), $.cos(X));
        }

        // besselj(x,n) = (2/x) (n-sgn(n)) besselj(x,n-sgn(n)) - besselj(x,n-2*sgn(n))
        const SGN = wrap_as_int(MSIGN(N.a));

        return $.subtract(
            $.multiply(
                $.multiply($.divide(two, X), N.sub(SGN)),
                besselj(X, $.subtract(N, SGN), $)
            ),
            besselj(X, $.subtract(N, two.mul(SGN)), $)
        );
    }

    //if 0 # test cases needed
    if (is_negative_term(X)) {
        return $.multiply(
            $.multiply($.power($.negate(X), N), $.power(X, $.negate(N))),
            makeList(BESSELJ, $.negate(X), N)
        );
    }

    if (is_negative_term(N)) {
        return $.multiply(
            $.power(negOne, N),
            makeList(BESSELJ, X, $.negate(N))
        );
    }

    return makeList(BESSELJ, X, N);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function jn(n: number, x: number): number {
    throw new Error('Not implemented');
    // See https://git.musl-libc.org/cgit/musl/tree/src/math/jn.c
    // https://github.com/SheetJS/bessel
}
