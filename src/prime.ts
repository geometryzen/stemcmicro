import { ExtensionEnv } from './env/ExtensionEnv';
import { nativeInt } from './nativeInt';
import { MAXPRIMETAB, primetab } from './runtime/constants';
import { halt } from './runtime/defs';
import { stack_push } from './runtime/stack';
import { cadr } from './tree/helpers';
import { create_int, Rat } from './tree/rat/Rat';
import { U } from './tree/tree';

//-----------------------------------------------------------------------------
//
//  Look up the nth prime
//
//  Input:    n (0 < n < 10001)
//
//  Output:    nth prime
//
//-----------------------------------------------------------------------------
export function Eval_prime(p1: U, $: ExtensionEnv): void {
    const result = prime($.valueOf(cadr(p1)));
    stack_push(result);
}

export function prime(p1: U): Rat {
    let n = nativeInt(p1);
    if (n < 1 || n > MAXPRIMETAB) {
        halt('prime: Argument out of range.');
    }
    n = primetab[n - 1];
    return create_int(n);
}
