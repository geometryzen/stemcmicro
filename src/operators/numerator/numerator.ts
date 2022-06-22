import { mp_numerator } from '../../bignum';
import { cadnr } from '../../calculators/cadnr';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { multiply_items } from '../../multiply';
import { is_negative } from '../../predicates/is_negative';
import { is_add, is_multiply, is_power } from '../../runtime/helpers';
import { caddr, cadr } from '../../tree/helpers';
import { one } from '../../tree/rat/Rat';
import { car, cdr, Cons, U } from '../../tree/tree';
import { is_rat } from '../rat/is_rat';
import { rationalize_factoring } from '../rationalize/rationalize';

export function Eval_numerator(p1: Cons, $: ExtensionEnv): U {
    return numerator($.valueOf(cadr(p1)), $);
}

export function numerator(p1: U, $: ExtensionEnv): U {
    // console.log(`numerator p1=${render_as_infix(p1, $)}`);
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

    if (is_power(p1) && is_negative(caddr(p1))) {
        const base = cadnr(p1, 1);
        const expo = cadnr(p1, 2);
        if ($.isReal(base) && $.isReal(expo)) {
            return one;
        }
    }

    return p1;
}
