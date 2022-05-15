import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { nativeInt } from './nativeInt';
import { is_sym } from './operators/sym/is_sym';
import { HERMITE, SECRETX } from './runtime/constants';
import { subst } from './subst';
import { integer, one, two, zero } from './tree/rat/Rat';
import { U } from './tree/tree';

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

// uses the recurrence relation H(x,n+1)=2*x*H(x,n)-2*n*H(x,n-1)
function yyhermite(X: U, N: U, $: ExtensionEnv): U {
    const n = nativeInt(N);
    if (n < 0 || isNaN(n)) {
        return makeList(HERMITE, X, N);
    }

    if (is_sym(X)) {
        return yyhermite2(n, X, $);
    }

    return $.valueOf(subst(yyhermite2(n, SECRETX, $), SECRETX, X, $));
}

function yyhermite2(n: number, p1: U, $: ExtensionEnv) {
    let Y1: U = zero;
    let temp: U = one;
    for (let i = 0; i < n; i++) {
        const Y0: U = Y1;
        Y1 = temp;
        temp = $.multiply($.subtract($.multiply(p1, Y1), $.multiply(integer(i), Y0)), two);
    }
    return temp;
}
