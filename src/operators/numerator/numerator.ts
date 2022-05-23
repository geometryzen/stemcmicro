import { mp_numerator } from '../../bignum';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { is_negative_term } from '../../is';
import { multiply_items } from '../../multiply';
import { rationalize_factoring } from '../rationalize/rationalize';
import { is_add, is_multiply, is_power } from '../../runtime/helpers';
import { caddr, cadr } from '../../tree/helpers';
import { is_rat } from '../../tree/rat/is_rat';
import { one } from '../../tree/rat/Rat';
import { car, cdr, Cons, U } from '../../tree/tree';

export function Eval_numerator(p1: Cons, $: ExtensionEnv): U {
    return numerator($.valueOf(cadr(p1)), $);
}

export function numerator(p1: U, $: ExtensionEnv): U {
    // console.lg(`numerator p1=${print_expr(p1, $)}`);
    if (is_add(p1)) {
        //console.trace "rationalising "
        p1 = rationalize_factoring(p1, $);
    }
    // console.lg(`rationalized=${print_expr(p1, $)}`);

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
