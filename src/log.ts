import { denominator } from './operators/denominator/denominator';
import { ExtensionEnv } from './env/ExtensionEnv';
import { imu } from './env/imu';
import { equaln, is_negative_number } from './is';
import { makeList } from './makeList';
import { numerator } from './operators/numerator/numerator';
import { is_base_of_natural_logarithm } from './predicates/is_base_of_natural_logarithm';
import { LOG } from './runtime/constants';
import { DynamicConstants } from './runtime/defs';
import { is_multiply, is_power } from './runtime/helpers';
import { stack_push } from './runtime/stack';
import { flt } from './tree/flt/Flt';
import { is_flt } from './tree/flt/is_flt';
import { caddr, cadr } from './tree/helpers';
import { is_rat } from './tree/rat/is_rat';
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
export function Eval_log(expr: Cons, $: ExtensionEnv): void {
    const result = logarithm($.valueOf(cadr(expr)), $);
    stack_push(result);
}

export function logarithm(expr: U, $: ExtensionEnv): U {
    if (is_base_of_natural_logarithm(expr)) {
        return one;
    }

    if (equaln(expr, 1)) {
        return zero;
    }

    if (is_negative_number(expr)) {
        return $.add(logarithm($.negate(expr), $), $.multiply(imu, DynamicConstants.Pi()));
    }

    if (is_flt(expr)) {
        return flt(Math.log(expr.d));
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
