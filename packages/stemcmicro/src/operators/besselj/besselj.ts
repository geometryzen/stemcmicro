import { create_int, negOne, one, zero } from "math-expression-atoms";
import { Directive, ExtensionEnv } from "../../env/ExtensionEnv";
import { divide } from "../../helpers/divide";
import { items_to_cons } from "../../makeList";
import { nativeInt } from "../../nativeInt";
import { is_negative } from "../../predicates/is_negative";
import { BESSELJ, MEQUAL, MSIGN } from "../../runtime/constants";
import { MATH_PI } from "../../runtime/ns_math";
import { create_flt } from "../../tree/flt/Flt";
import { caddr, cadr } from "../../tree/helpers";
import { half, two } from "../../tree/rat/Rat";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { is_rat } from "../rat/is_rat";

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
export function eval_besselj(p1: U, $: ExtensionEnv): U {
    return besselj($.valueOf(cadr(p1)), $.valueOf(caddr(p1)), $);
}

export function besselj(p1: U, p2: U, $: ExtensionEnv): U {
    return yybesselj(p1, p2, $);
}

function yybesselj(X: U, N: U, $: ExtensionEnv): U {
    const n = nativeInt(N);

    // numerical result
    if (is_flt(X) && !isNaN(n)) {
        const d = jn(n, X.d);
        return create_flt(d);
    }

    // bessej(0,0) = 1
    if ($.iszero(X) && $.iszero(N)) {
        return one;
    }

    // besselj(0,n) = 0
    if ($.iszero(X) && !isNaN(n)) {
        return zero;
    }

    // half arguments
    if (is_rat(N) && MEQUAL(N.b, 2)) {
        // n = 1/2
        if (MEQUAL(N.a, 1)) {
            const twoOverPi = $.getDirective(Directive.evaluatingAsFloat) ? create_flt(2.0 / Math.PI) : divide(two, MATH_PI, $);
            return $.multiply($.power(divide(twoOverPi, X, $), half), $.sin(X));
        }

        // n = -1/2
        if (MEQUAL(N.a, -1)) {
            const twoOverPi = $.getDirective(Directive.evaluatingAsFloat) ? create_flt(2.0 / Math.PI) : divide(two, MATH_PI, $);
            return $.multiply($.power(divide(twoOverPi, X, $), half), $.cos(X));
        }

        // besselj(x,n) = (2/x) (n-sgn(n)) besselj(x,n-sgn(n)) - besselj(x,n-2*sgn(n))
        const SGN = create_int(MSIGN(N.a));

        return $.subtract($.multiply($.multiply(divide(two, X, $), N.sub(SGN)), besselj(X, $.subtract(N, SGN), $)), besselj(X, $.subtract(N, two.mul(SGN)), $));
    }

    //if 0 # test cases needed
    if (is_negative(X)) {
        return $.multiply($.multiply($.power($.negate(X), N), $.power(X, $.negate(N))), items_to_cons(BESSELJ, $.negate(X), N));
    }

    if (is_negative(N)) {
        return $.multiply($.power(negOne, N), items_to_cons(BESSELJ, X, $.negate(N)));
    }

    return items_to_cons(BESSELJ, X, N);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function jn(n: number, x: number): number {
    throw new Error("Not implemented");
    // See https://git.musl-libc.org/cgit/musl/tree/src/math/jn.c
    // https://github.com/SheetJS/bessel
}
