import { ExtensionEnv } from './env/ExtensionEnv';
import { factorial } from './factorial';
import { guess } from './guess';
import { makeList } from './makeList';
import { nativeInt } from './nativeInt';
import { TAYLOR } from './runtime/constants';
import { stack_peek, stack_push } from './runtime/stack';
import { subst } from './subst';
import { integer, one, zero } from './tree/rat/Rat';
import { car, cdr, NIL, U } from './tree/tree';

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
    const X = NIL === p2 ? guess(stack_peek()) : p2; // TODO: should this be `top()`?

    // 3rd arg
    p1 = cdr(p1);
    p2 = $.valueOf(car(p1));
    const N = NIL === p2 ? integer(24) : p2; // 24: default number of terms

    // 4th arg
    p1 = cdr(p1);
    p2 = $.valueOf(car(p1));
    const A = NIL === p2 ? zero : p2; // 0: default expansion point

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
        F = $.derivative(F, X); // F: f = f'

        if ($.isZero(F)) {
            break;
        }

        // c = c * (x - a)
        p5 = $.multiply(p5, $.subtract(X, A));

        const arg1a = $.valueOf(subst(F, X, A, $)); // F: f(a)
        temp = $.add(temp, $.divide($.multiply(arg1a, p5), factorial(integer(i))));
    }
    return temp;
}
