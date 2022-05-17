import { mp_numerator } from './bignum';
import { ExtensionEnv } from './env/ExtensionEnv';
import { is_negative_term } from './is';
import { multiply_items } from './multiply';
import { rationalize_factoring } from './rationalize';
import { is_add, is_multiply, is_power } from './runtime/helpers';
import { stack_push } from './runtime/stack';
import { caddr, cadr } from './tree/helpers';
import { is_rat } from './tree/rat/is_rat';
import { one } from './tree/rat/Rat';
import { car, cdr, U } from './tree/tree';

export function Eval_numerator(p1: U, $: ExtensionEnv): void {
    const result = numerator($.valueOf(cadr(p1)), $);
    stack_push(result);
}

export function numerator(p1: U, $: ExtensionEnv): U {
    if (is_add(p1)) {
        //console.trace "rationalising "
        p1 = rationalize_factoring(p1, $);
    }
    // console.lg "rationalised: " + p1

    if (is_multiply(p1) && !$.isOne(car(cdr(p1)))) {
        // console.lg "p1 inside multiply: " + p1
        // console.lg "first term: " + car(p1)
        return multiply_items(p1.tail().map(function (x) {
            return numerator(x, $);
        }), $);
    }

    if (is_rat(p1)) {
        return mp_numerator(p1);
    }

    if (is_power(p1) && is_negative_term(caddr(p1))) {
        return one;
    }

    return p1;
}
