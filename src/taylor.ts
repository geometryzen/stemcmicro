import { ExtensionEnv } from './env/ExtensionEnv';
import { factorial } from './factorial';
import { guess } from './guess';
import { makeList } from './makeList';
import { nativeInt } from './nativeInt';
import { derivative_wrt } from './operators/derivative/derivative_wrt';
import { TAYLOR } from './runtime/constants';
import { stack_peek, stack_push } from './runtime/stack';
import { subst } from './subst';
import { wrap_as_int, one, zero } from './tree/rat/Rat';
import { car, cdr, nil, U } from './tree/tree';

/*
Taylor expansion of a function

  push(F)
  push(X)
  push(N)
  push(A)
  taylor()
*/
export function Eval_taylor(p1: U, $: ExtensionEnv): void {
    // 1st arg
    p1 = cdr(p1);
    const F = $.valueOf(car(p1));

    // 2nd arg
    p1 = cdr(p1);
    let p2 = $.valueOf(car(p1));
    const X = nil === p2 ? guess(stack_peek()) : p2; // TODO: should this be `top()`?

    // 3rd arg
    p1 = cdr(p1);
    p2 = $.valueOf(car(p1));
    const N = nil === p2 ? wrap_as_int(24) : p2; // 24: default number of terms

    // 4th arg
    p1 = cdr(p1);
    p2 = $.valueOf(car(p1));
    const A = nil === p2 ? zero : p2; // 0: default expansion point

    stack_push(taylor(F, X, N, A, $));
}

function taylor(F: U, X: U, N: U, A: U, $: ExtensionEnv): U {
    const k = nativeInt(N);
    if (isNaN(k)) {
        return makeList(TAYLOR, F, X, N, A);
    }

    let p5: U = one;
    let temp = $.valueOf(subst(F, X, A, $)); // F: f(a)
    for (let i = 1; i <= k; i++) {
        F = derivative_wrt(F, X, $); // F: f = f'

        if ($.isZero(F)) {
            break;
        }

        // c = c * (x - a)
        p5 = $.multiply(p5, $.subtract(X, A));

        const arg1a = $.valueOf(subst(F, X, A, $)); // F: f(a)
        temp = $.add(temp, $.divide($.multiply(arg1a, p5), factorial(wrap_as_int(i))));
    }
    return temp;
}
