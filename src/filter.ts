import { ExtensionEnv } from './env/ExtensionEnv';
import { is_add } from './runtime/helpers';
import { stack_push } from './runtime/stack';
import { is_tensor } from './tree/tensor/is_tensor';
import { Tensor } from './tree/tensor/Tensor';
import { zero } from './tree/rat/Rat';
import { car, cdr, is_cons, U } from './tree/tree';

/*
Remove terms that involve a given symbol or expression. For example...

  filter(x^2 + x + 1, x)    =>  1

  filter(x^2 + x + 1, x^2)  =>  x + 1
*/
export function Eval_filter(p1: U, $: ExtensionEnv): void {
    p1 = cdr(p1);
    let result = $.valueOf(car(p1));

    if (is_cons(p1)) {
        result = p1.tail().reduce((acc: U, p: U) => filter(acc, $.valueOf(p), $), result);
    }
    stack_push(result);
}

/**
 * Filter out terms in the polynomial f that contain x.
 * In other words, return only the constant part of f when x is the variable.
 * @param F 
 * @param X 
 */
export function filter(F: U, X: U, $: ExtensionEnv): U {
    return filter_main(F, X, $);
}

function filter_main(F: U, X: U, $: ExtensionEnv): U {
    if (is_add(F)) {
        return filter_sum(F, X, $);
    }

    if (is_tensor(F)) {
        return filter_tensor(F, X, $);
    }

    if (F.contains(X)) {
        return zero;
    }

    return F;
}

function filter_sum(F: U, X: U, $: ExtensionEnv): U {
    return is_cons(F)
        ? F.tail().reduce((a: U, b: U) => $.add(a, filter(b, X, $)), zero)
        : zero;
}

function filter_tensor(F: Tensor, X: U, $: ExtensionEnv): U {
    return F.map((f) => filter(f, X, $));
}
