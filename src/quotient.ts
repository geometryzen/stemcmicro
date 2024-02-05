import { create_int, zero } from 'math-expression-atoms';
import { Cons, U } from 'math-expression-tree';
import { ExtensionEnv } from './env/ExtensionEnv';
import { divide } from './helpers/divide';
import { coefficients } from './operators/coeff/coeff';
import { SYMBOL_X } from './runtime/constants';

/**
 * (quotient p q x)
 * 
 * @returns the quotient of the polynomial p(x) over q(x).
 * 
 * The remainder can be calculated by p - q * quotient(p,q)
 */
export function Eval_quotient(expr: Cons, $: ExtensionEnv): U {
    const p = $.valueOf(expr.item1);
    const q = $.valueOf(expr.item2);
    const X = $.valueOf(expr.item3);
    if (!X.isnil) {
        return quotient(p, q, X, $);
    }
    else {
        return quotient(p, q, SYMBOL_X, $);
    }
}

export function quotient(p: U, q: U, X: U, $: ExtensionEnv): U {
    const dividendCs = coefficients(p, X, $);
    let m = dividendCs.length - 1; // m is dividend's highest power

    const divisorCs = coefficients(q, X, $);
    const n = divisorCs.length - 1; // n is divisor's highest power

    let x = m - n;

    let retval: U = zero;
    while (x >= 0) {
        const Q = divide(dividendCs[m], divisorCs[n], $);

        for (let i = 0; i <= n; i++) {
            dividendCs[x + i] = $.subtract(dividendCs[x + i], $.multiply(divisorCs[i], Q));
        }

        retval = $.add(retval, $.multiply(Q, $.power(X, create_int(x))));

        m--;
        x--;
    }

    return retval;
}
