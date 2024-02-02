import { ExtensionEnv } from './env/ExtensionEnv';
import { divide } from './helpers/divide';
import { coeff } from './operators/coeff/coeff';
import { SYMBOL_X } from './runtime/constants';
import { cadddr, caddr, cadr } from './tree/helpers';
import { create_int, zero } from './tree/rat/Rat';
import { U } from './tree/tree';

// Divide polynomials
export function Eval_quotient(p1: U, $: ExtensionEnv): U {
    const DIVIDEND = $.valueOf(cadr(p1)); // 1st arg, p(x)
    const DIVISOR = $.valueOf(caddr(p1)); // 2nd arg, q(x)
    const X = $.valueOf(cadddr(p1)); // 3rd arg, x, default x
    if (!X.isnil) {
        return divpoly(DIVIDEND, DIVISOR, X, $);
    }
    else {
        return divpoly(DIVIDEND, DIVISOR, SYMBOL_X, $);
    }
}

//-----------------------------------------------------------------------------
//
//  Divide polynomials
//
//  Input:    Dividend
//            Divisor
//            x
//
//  Output:    Quotient
//
//-----------------------------------------------------------------------------
export function divpoly(DIVIDEND: U, DIVISOR: U, X: U, $: ExtensionEnv): U {
    const dividendCs = coeff(DIVIDEND, X, $);
    let m = dividendCs.length - 1; // m is dividend's power

    const divisorCs = coeff(DIVISOR, X, $);
    const n = divisorCs.length - 1; // n is divisor's power

    let x = m - n;

    let QUOTIENT: U = zero;
    while (x >= 0) {
        const Q = divide(dividendCs[m], divisorCs[n], $);

        for (let i = 0; i <= n; i++) {
            dividendCs[x + i] = $.subtract(dividendCs[x + i], $.multiply(divisorCs[i], Q));
        }

        QUOTIENT = $.add(QUOTIENT, $.multiply(Q, $.power(X, create_int(x))));

        m--;
        x--;
    }

    return QUOTIENT;
}
