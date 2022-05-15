import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { makeList } from './makeList';
import { abs } from './operators/abs/abs';
import { is_sym } from './operators/sym/is_sym';
import { is_imu } from './predicates/is_imu';
import { ASSUME_REAL_VARIABLES, COS, YYRECT } from './runtime/constants';
import { has_clock_form, has_exp_form } from './runtime/find';
import { is_add, is_multiply } from './runtime/helpers';
import { MATH_SIN } from './runtime/ns_math';
import { stack_push } from './runtime/stack';
import { sine } from './sin';
import { cadr } from './tree/helpers';
import { zero } from './tree/rat/Rat';
import { is_cons, U } from './tree/tree';

/*
Convert complex z to rectangular form

  Input:    push  z

  Output:    Result on stack
*/

export function Eval_rect(p1: U, $: ExtensionEnv): void {
    const result = rect($.valueOf(cadr(p1)), $);
    stack_push(result);
}

export function rect(p1: U, $: ExtensionEnv): U {

    // if we assume real variables, then the
    // rect of any symbol is the symbol itself
    // (note that 'i' is not a symbol, it's made of (-1)^(1/2))
    // otherwise we have to leave unevalled
    if (is_sym(p1)) {
        if (!$.isZero($.getBinding(ASSUME_REAL_VARIABLES))) {
            return p1;
        }

        return makeList(YYRECT, p1);

        // TODO this is quite dirty, ideally we don't need this
        // but removing this creates a few failings in the tests
        // that I can't investigate right now.
        // --
        // if we assume all variables are real AND
        // it's not an exponential nor a polar nor a clock form
        // THEN rect(_) = _
        // note that these matches can be quite sloppy, one can find expressions
        // which shouldn't match but do
        //
    }

    if (!$.isZero($.getBinding(ASSUME_REAL_VARIABLES)) && !has_exp_form(p1, $) && !has_clock_form(p1, p1, $) &&
        !(p1.contains(MATH_SIN) && p1.contains(COS) && p1.contains(imu))
    ) {
        // no polar form?
        return p1; // ib
    }

    if (is_cons(p1) && is_multiply(p1) && is_imu(cadr(p1)) && !$.isZero($.getBinding(ASSUME_REAL_VARIABLES))) {
        return p1; // sum
    }

    if (is_cons(p1) && is_add(p1)) {
        return p1.tail().reduce((a: U, b: U) => $.add(a, rect(b, $)), zero);
    }

    // try to get to the rectangular form by doing
    // abs(p1) * (cos (theta) + i * sin(theta))
    // where theta is arg(p1)
    // abs(z) * (cos(arg(z)) + i sin(arg(z)))
    const result = $.multiply(
        abs(p1, $),
        $.add($.cos($.arg(p1)), $.multiply(imu, sine($.arg(p1), $)))
    );

    return result;
}
