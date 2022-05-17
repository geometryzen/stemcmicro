import { ExtensionEnv } from './env/ExtensionEnv';
import { gcd } from './gcd';
import { multiply_noexpand } from './multiply';
import { use_factoring_with_unary_function } from './runtime/defs';
import { is_add } from './runtime/helpers';
import { stack_push } from './runtime/stack';
import { doexpand_eval } from './scripting/doexpand_eval';
import { cadr } from './tree/helpers';
import { zero } from './tree/rat/Rat';
import { U } from './tree/tree';

// Condense an expression by factoring common terms.

export function Eval_condense(p1: U, $: ExtensionEnv): void {
    const result = condense($.valueOf(cadr(p1)), $);
    stack_push(result);
}

export function condense(p1: U, $: ExtensionEnv): U {
    return use_factoring_with_unary_function(yycondense, p1, $);
}

export function yycondense(p1: U, $: ExtensionEnv): U {
    //expanding = 0
    if (!is_add(p1)) {
        return p1;
    }

    // get gcd of all terms
    const termsGCD = p1.tail().reduce(function (x, y) {
        return gcd(x, y, $);
    });

    // console.lg "condense: this is the gcd of all the terms: " + stack[tos - 1]

    // divide each term by gcd
    const p2 = $.inverse(termsGCD);
    const temp2 = p1
        .tail()
        .reduce((a: U, b: U) => $.add(a, multiply_noexpand(p2, b, $)), zero);

    // We multiplied above w/o expanding so some factors cancelled.

    // Now we expand which normalizes the result and, in some cases,
    // simplifies it too (see test case H).

    const arg1 = doexpand_eval(temp2, $);

    // multiply result by gcd
    return $.divide(arg1, p2);
}
