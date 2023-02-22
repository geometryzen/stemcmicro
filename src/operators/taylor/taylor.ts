import { ExtensionEnv } from '../../env/ExtensionEnv';
import { factorial } from '../factorial/factorial';
import { guess } from '../../guess';
import { makeList } from '../../makeList';
import { nativeInt } from '../../nativeInt';
import { TAYLOR } from '../../runtime/constants';
import { stack_peek } from '../../runtime/stack';
import { subst } from '../subst/subst';
import { one, wrap_as_int, zero } from '../../tree/rat/Rat';
import { car, cdr, NIL, U } from '../../tree/tree';
import { derivative } from '../derivative/derivative';

/*
Taylor expansion of a function

  push(F)
  push(X)
  push(N)
  push(A)
  taylor()
*/
export function Eval_taylor(p1: U, $: ExtensionEnv): U {
    // 1st arg
    p1 = cdr(p1);
    const F = $.valueOf(car(p1));

    // 2nd arg
    p1 = cdr(p1);
    let p2 = $.valueOf(car(p1));
    const X = NIL === p2 ? guess(stack_peek()) : p2; // TODO: should this be `top()`?

    // 3rd arg
    p1 = cdr(p1);
    p2 = $.valueOf(car(p1));
    const N = NIL === p2 ? wrap_as_int(24) : p2; // 24: default number of terms

    // 4th arg
    p1 = cdr(p1);
    p2 = $.valueOf(car(p1));
    const A = NIL === p2 ? zero : p2; // 0: default expansion point

    return taylor(F, X, N, A, $);
}

/**
 * Returns the Taylor expansion of f(x) around x=a. If "a" is omitted then a=0 is used.
 * The argument n is the degree of the expansion.
 * 
 * Strictly speaking, Taylor's theorem provides a k-th order Taylor polynomial and a remainder term.
 * This function computes the k-th order Taylor polynomial.
 * 
 * @param F 
 * @param X 
 * @param N 
 * @param A 
 * @param $ 
 * @returns 
 */
function taylor(f: U, X: U, N: U, A: U, $: ExtensionEnv): U {
    const k = nativeInt(N);
    if (isNaN(k)) {
        return makeList(TAYLOR, f, X, N, A);
    }

    const x_minus_a = $.subtract(X, A);

    // F contains the i-th derivative of f, initially f.
    let dfi = f;
    // The weight factor in the i-th term is (x-a)**i
    let weight: U = one;
    // retval accumulates the terms in the Taylor polynomial.
    let retval = $.valueOf(subst(dfi, X, A, $)); // The first term in the Taylor polynomial is f(a).
    // Now compute and add the terms that follow up to the required degree.
    for (let i = 1; i <= k; i++) {
        // F now contains the i-th derivative
        dfi = derivative(dfi, X, $); // F: f = f'

        if ($.isZero(dfi)) {
            break;
        }

        // c = c * (x - a)
        weight = $.multiply(weight, x_minus_a);

        const dfi_at_a = $.valueOf(subst(dfi, X, A, $)); // F: f(a)
        const term = $.divide($.multiply(dfi_at_a, weight), factorial(wrap_as_int(i)));
        retval = $.add(retval, term);
    }
    return retval;
}
