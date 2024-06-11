import { create_int, is_sym, one, Sym, two, zero } from "@stemcmicro/atoms";
import { num_to_number, subst } from "@stemcmicro/helpers";
import { items_to_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { HERMITE, SECRETX } from "../../runtime/constants";

//-----------------------------------------------------------------------------
//
//  Hermite polynomial
//
//  Input:    p1    x  (can be a symbol or expr)
//            p2    n
//
//  Output:    Result
//
//-----------------------------------------------------------------------------
export function hermite(p1: U, p2: U, $: ExtensionEnv): U {
    return yyhermite(p1, p2, $);
}

// uses the recurrence relation H(x,n+1)=2*x*H(x,n)-2*n*H(x,n-1) = 2 * (x*H(x,n)-n*H(x,n-1))
function yyhermite(X: U, N: U, $: ExtensionEnv): U {
    const n = num_to_number(N);
    if (n < 0 || isNaN(n)) {
        return items_to_cons(HERMITE, X, N);
    }

    if (is_sym(X)) {
        return yyhermite2(n, X, $);
    }

    return $.valueOf(subst(yyhermite2(n, SECRETX, $), SECRETX, X, $));
}

function yyhermite2(n: number, X: Sym, $: ExtensionEnv) {
    let Y1: U = zero;
    let temp: U = one;
    for (let i = 0; i < n; i++) {
        const Y0: U = Y1;
        Y1 = temp;
        temp = $.multiply($.subtract($.multiply(X, Y1), $.multiply(create_int(i), Y0)), two);
    }
    return temp;
}
