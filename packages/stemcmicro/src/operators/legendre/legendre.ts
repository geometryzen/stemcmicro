import { create_int, one, zero } from "@stemcmicro/atoms";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { divide } from "../../helpers/divide";
import { items_to_cons } from "../../makeList";
import { nativeInt } from "../../nativeInt";
import { COS, LEGENDRE, SECRETX, SIN } from "../../runtime/constants";
import { square } from "../../square";
import { cadddr, caddr, cadr } from "../../tree/helpers";
import { half } from "../../tree/rat/Rat";
import { car, U } from "../../tree/tree";
import { derivative } from "../derivative/derivative";
import { subst } from "../subst/subst";
import { is_sym } from "../sym/is_sym";

/*
 Legendre function

Example

  legendre(x,3,0)

Result

   5   3    3
  --- x  - --- x
   2        2

The computation uses the following recurrence relation.

  P(x,0) = 1

  P(x,1) = x

  n*P(x,n) = (2*(n-1)+1)*x*P(x,n-1) - (n-1)*P(x,n-2)

In the "for" loop we have i = n-1 so the recurrence relation becomes

  (i+1)*P(x,n) = (2*i+1)*x*P(x,n-1) - i*P(x,n-2)

For m > 0

  P(x,n,m) = (-1)^m * (1-x^2)^(m/2) * d^m/dx^m P(x,n)
*/
export function eval_legendre(p1: U, $: ExtensionEnv): U {
    const X = $.valueOf(cadr(p1));
    const N = $.valueOf(caddr(p1));
    const p2 = $.valueOf(cadddr(p1));
    const M = p2.isnil ? zero : p2;

    return legendre(X, N, M, $);
}

function legendre(X: U, N: U, M: U, $: ExtensionEnv): U {
    return __legendre(X, N, M, $);
}

function __legendre(X: U, N: U, M: U, $: ExtensionEnv): U {
    const n = nativeInt(N);
    const m = nativeInt(M);

    if (n < 0 || isNaN(n) || m < 0 || isNaN(m)) {
        return items_to_cons(LEGENDRE, X, N, M);
    }

    let result: U;
    if (is_sym(X)) {
        result = __legendre2(n, m, X, $);
    } else {
        const expr = __legendre2(n, m, SECRETX, $);
        result = $.valueOf(subst(expr, SECRETX, X, $));
    }
    result = __legendre3(result, m, X, $) || result;
    return result;
}

function __legendre2(n: number, m: number, X: U, $: ExtensionEnv): U {
    let Y0: U = zero;
    let Y1: U = one;

    //  i=1  Y0 = 0
    //    Y1 = 1
    //    ((2*i+1)*x*Y1 - i*Y0) / i = x
    //
    //  i=2  Y0 = 1
    //    Y1 = x
    //    ((2*i+1)*x*Y1 - i*Y0) / i = -1/2 + 3/2*x^2
    //
    //  i=3  Y0 = x
    //    Y1 = -1/2 + 3/2*x^2
    //    ((2*i+1)*x*Y1 - i*Y0) / i = -3/2*x + 5/2*x^3
    for (let i = 0; i < n; i++) {
        const divided = divide($.subtract($.multiply($.multiply(create_int(2 * i + 1), X), Y1), $.multiply(create_int(i), Y0)), create_int(i + 1), $);
        Y0 = Y1;
        Y1 = divided;
    }

    for (let i = 0; i < m; i++) {
        Y1 = derivative(Y1, X, $);
    }

    return Y1;
}

// moveTos tos * (-1)^m * (1-x^2)^(m/2)
function __legendre3(p1: U, m: number, X: U, $: ExtensionEnv): U | undefined {
    if (m === 0) {
        return;
    }

    let base = $.subtract(one, square(X, $));
    if (car(X).equals(COS)) {
        base = square($.sin(cadr(X)), $);
    } else if (car(X).equals(SIN)) {
        base = square($.cos(cadr(X)), $);
    }

    let result = $.multiply(p1, $.power(base, $.multiply(create_int(m), half)));

    if (m % 2) {
        result = $.negate(result);
    }
    return result;
}
