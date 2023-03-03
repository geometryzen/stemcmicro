import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { makeList } from './makeList';
import { denominator } from './operators/denominator/denominator';
import { is_flt } from './operators/flt/is_flt';
import { numerator } from './operators/numerator/numerator';
import { is_rat } from './operators/rat/is_rat';
import { is_base_of_natural_logarithm } from './predicates/is_base_of_natural_logarithm';
import { is_negative_number } from './predicates/is_negative_number';
import { LOG } from './runtime/constants';
import { DynamicConstants } from './runtime/defs';
import { is_multiply, is_power } from './runtime/helpers';
import { wrap_as_flt, zeroAsFlt } from './tree/flt/Flt';
import { caddr, cadr } from './tree/helpers';
import { one, zero } from './tree/rat/Rat';
import { Cons, U } from './tree/tree';

// Natural logarithm.
//
// Note that we use the mathematics / Javascript / Mathematica
// convention that "log" is indeed the natural logarithm.
//
// In engineering, biology, astronomy, "log" can stand instead
// for the "common" logarithm i.e. base 10. Also note that Google
// calculations use log for the common logarithm.
export function Eval_log(expr: Cons, $: ExtensionEnv): U {
    return logarithm($.valueOf(cadr(expr)), $);
}

export function logarithm(expr: U, $: ExtensionEnv): U {
    // console.lg("logarithm", render_as_infix(expr, $));
    if (is_base_of_natural_logarithm(expr)) {
        return one;
    }

    if (is_rat(expr) && expr.isOne()) {
        return zero;
    }

    if (is_flt(expr) && expr.isOne()) {
        return zeroAsFlt;
    }

    if (is_negative_number(expr)) {
        const termRe = logarithm($.negate(expr), $);
        const termIm = $.multiply(imu, DynamicConstants.Pi($));
        return $.add(termRe, termIm);
    }

    if (is_flt(expr)) {
        return wrap_as_flt(Math.log(expr.d));
    }

    // rational number and not an integer?
    if (is_rat(expr) && expr.isFraction()) {
        return $.subtract(logarithm(numerator(expr, $), $), logarithm(denominator(expr, $), $));
    }

    // log(a ^ b) --> b log(a)
    if (is_power(expr)) {
        return $.multiply(caddr(expr), logarithm(cadr(expr), $));
    }

    // log(a * b) --> log(a) + log(b)
    if (is_multiply(expr)) {
        return expr.tail().map(function (x) {
            return logarithm(x, $);
        }).reduce(function (x, y) {
            return $.add(x, y);
        }, zero);
    }

    return makeList(LOG, expr);
}
