import { lt_num_num } from './calculators/compare/lt_num_num';
import { ExtensionEnv } from './env/ExtensionEnv';
import { factorial } from './factorial';
import { is_num } from './operators/num/is_num';
import { stack_push } from './runtime/stack';
import { caddr, cadr } from './tree/helpers';
import { zero } from './tree/rat/Rat';
import { U } from './tree/tree';

//  Binomial coefficient
//
//  Input:    tos-2    n
//
//      tos-1    k
//
//  Output:    Binomial coefficient on stack
//
//  binomial(n, k) = n! / k! / (n - k)!
//
//  The binomial coefficient vanishes for k < 0 or k > n. (A=B, p. 19)

export function Eval_binomial(p1: U, $: ExtensionEnv): void {
    const N = $.valueOf(cadr(p1));
    const K = $.valueOf(caddr(p1));
    const result = binomial(N, K, $);
    stack_push(result);
}

function binomial(N: U, K: U, $: ExtensionEnv): U {
    return ybinomial(N, K, $);
}

function ybinomial(N: U, K: U, $: ExtensionEnv): U {
    if (!BINOM_check_args(N, K, $)) {
        return zero;
    }

    return $.divide($.divide(factorial(N), factorial(K)), factorial($.subtract(N, K)));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function BINOM_check_args(N: U, K: U, $: ExtensionEnv): boolean {
    if (is_num(N) && lt_num_num(N, zero)) {
        return false;
    }
    else if (is_num(K) && lt_num_num(K, zero)) {
        return false;
    }
    else if (is_num(N) && is_num(K) && lt_num_num(N, K)) {
        return false;
    }
    else {
        return true;
    }
}
