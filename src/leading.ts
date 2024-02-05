import { ExtensionEnv } from './env/ExtensionEnv';
import { filter } from './filter';
import { guess } from './guess';
import { divide } from './helpers/divide';
import { degree } from './operators/degree/degree';
import { caddr, cadr } from './tree/helpers';
import { U } from './tree/tree';

/*
 Return the leading coefficient of a polynomial.

Example

  leading(5x^2+x+1,x)

Result

  5

The result is undefined if P is not a polynomial.
*/
export function Eval_leading(p1: U, $: ExtensionEnv): U {
    const P = $.valueOf(cadr(p1));
    p1 = $.valueOf(caddr(p1));
    const X = p1.isnil ? guess(P) : p1;
    return leading(P, X, $);
}

function leading(P: U, X: U, $: ExtensionEnv) {
    // N = degree of P
    const N = degree(P, X, $);

    // divide through by X ^ N, remove terms that depend on X
    return filter(divide(P, $.power(X, N), $), X, $);
}
