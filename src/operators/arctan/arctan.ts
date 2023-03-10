import { rational } from '../../bignum';
import { Directive, ExtensionEnv } from '../../env/ExtensionEnv';
import { equaln, equalq } from '../../is';
import { makeList } from '../../makeList';
import { is_negative } from '../../predicates/is_negative';
import { ARCTAN, COS, PI, POWER, SIN, TAN } from '../../runtime/constants';
import { DynamicConstants } from '../../runtime/defs';
import { is_multiply, is_power } from '../../runtime/helpers';
import { create_flt, piAsFlt } from '../../tree/flt/Flt';
import { caddr, cadr } from '../../tree/helpers';
import { third, zero } from '../../tree/rat/Rat';
import { car, cdr, U } from '../../tree/tree';
import { denominator } from '../denominator/denominator';
import { is_flt } from '../flt/is_flt';
import { numerator } from '../numerator/numerator';

/* arctan =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse tangent of x.

*/
export function Eval_arctan(x: U, $: ExtensionEnv): U {
    return arctan($.valueOf(cadr(x)), $);
}

export function arctan(x: U, $: ExtensionEnv): U {
    if (car(x).equals(TAN)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        return create_flt(Math.atan(x.d));
    }

    if ($.isZero(x)) {
        return zero;
    }

    if (is_negative(x)) {
        return $.negate(arctan($.negate(x), $));
    }

    // arctan(sin(a) / cos(a)) ?
    if (x.contains(SIN) && x.contains(COS)) {
        const p2 = numerator(x, $);
        const p3 = denominator(x, $);
        if (car(p2).equals(SIN) && car(p3).equals(COS) && $.equals(cadr(p2), cadr(p3))) {
            return cadr(p2);
        }
    }

    // arctan(1/sqrt(3)) -> pi/6
    // second if catches the other way of saying it, sqrt(3)/3
    if (
        (is_power(x) && equaln(cadr(x), 3) && equalq(caddr(x), -1, 2)) ||
        (is_multiply(x) &&
            equalq(car(cdr(x)), 1, 3) &&
            car(car(cdr(cdr(x)))).equals(POWER) &&
            equaln(car(cdr(car(cdr(cdr(x))))), 3) &&
            equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.multiply(rational(1, 6), $.getNativeDirective(Directive.evaluatingAsFloat) ? piAsFlt : PI);
    }

    // arctan(1) -> pi/4
    if (equaln(x, 1)) {
        return $.multiply(rational(1, 4), DynamicConstants.Pi($));
    }

    // arctan(sqrt(3)) -> pi/3
    if (is_power(x) && equaln(cadr(x), 3) && equalq(caddr(x), 1, 2)) {
        return $.multiply(third, DynamicConstants.Pi($));
    }

    return makeList(ARCTAN, x);
}
