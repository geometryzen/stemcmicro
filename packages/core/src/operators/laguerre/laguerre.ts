import { create_int, is_sym, one, zero } from "@stemcmicro/atoms";
import { divide, num_to_number, subst } from "@stemcmicro/helpers";
import { cadddr, caddr, cadr, items_to_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { LAGUERRE, SECRETX } from "../../runtime/constants";

/*
 Laguerre function

Example

  laguerre(x,3)

Result

     1   3    3   2
  - --- x  + --- x  - 3 x + 1
     6        2

The computation uses the following recurrence relation.

  L(x,0,k) = 1

  L(x,1,k) = -x + k + 1

  n*L(x,n,k) = (2*(n-1)+1-x+k)*L(x,n-1,k) - (n-1+k)*L(x,n-2,k)

In the "for" loop i = n-1 so the recurrence relation becomes

  (i+1)*L(x,n,k) = (2*i+1-x+k)*L(x,n-1,k) - (i+k)*L(x,n-2,k)
*/
export function eval_laguerre(p1: U, $: ExtensionEnv): U {
    const X = $.valueOf(cadr(p1));
    const N = $.valueOf(caddr(p1));
    const p2 = $.valueOf(cadddr(p1));
    const K = p2.isnil ? zero : p2;

    return laguerre(X, N, K, $);
}

function laguerre(X: U, N: U, K: U, $: ExtensionEnv): U {
    const n = num_to_number(N);
    if (n < 0 || isNaN(n)) {
        return items_to_cons(LAGUERRE, X, N, K);
    }

    if (is_sym(X)) {
        return laguerre2(n, X, K, $);
    }

    return $.valueOf(subst(laguerre2(n, SECRETX, K, $), SECRETX, X, $));
}

function laguerre2(n: number, p1: U, p3: U, $: ExtensionEnv): U {
    let Y0: U = zero;
    let Y1: U = one;

    for (let i = 0; i < n; i++) {
        const result = divide($.subtract($.multiply($.add($.subtract(create_int(2 * i + 1), p1), p3), Y1), $.multiply($.add(create_int(i), p3), Y0)), create_int(i + 1), $);
        Y0 = Y1;
        Y1 = result;
    }

    return Y1;
}
