import { rational } from '../../bignum';
import { Directive, ExtensionEnv } from '../../env/ExtensionEnv';
import {
    equaln, isminusoneoversqrttwo,
    isMinusSqrtThreeOverTwo,
    isoneoversqrttwo,
    isSqrtThreeOverTwo, is_num_and_equalq
} from '../../is';
import { items_to_cons } from '../../makeList';
import { Native } from '../../native/Native';
import { native_sym } from '../../native/native_sym';
import { nativeInt } from '../../nativeInt';
import { is_negative } from '../../predicates/is_negative';
import { ARCCOS, POWER } from '../../runtime/constants';
import { is_multiply } from '../../runtime/helpers';
import { create_flt, piAsFlt, zeroAsFlt } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { half, third, two, zero } from '../../tree/rat/Rat';
import { car, cdr, U } from '../../tree/tree';
import { is_flt } from '../flt/is_flt';
import { is_rat } from '../rat/is_rat';

export const COS = native_sym(Native.cos);
export const Pi = native_sym(Native.mathematical_constant_Pi);

/* arccos =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse cosine of x.

*/
export function arccos(x: U, $: ExtensionEnv): U {
    if (car(x).equals(COS)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        return create_flt(Math.acos(x.d));
    }

    if (is_negative(x)) {
        return $.subtract(Pi, $.arccos($.negate(x)));
    }

    // if x == 1/sqrt(2) then return 1/4*pi (45 degrees)
    // second if catches the other way of saying it, sqrt(2)/2
    if (
        isoneoversqrttwo(x) ||
        (is_multiply(x) &&
            is_num_and_equalq(car(cdr(x)), 1, 2) &&
            car(car(cdr(cdr(x)))).equals(POWER) &&
            equaln(car(cdr(car(cdr(cdr(x))))), 2) &&
            is_num_and_equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 4.0) : $.multiply(rational(1, 4), Pi);
    }

    // if x == -1/sqrt(2) then return 3/4*pi (135 degrees)
    // second if catches the other way of saying it, -sqrt(2)/2
    if (
        isminusoneoversqrttwo(x) ||
        (is_multiply(x) &&
            is_num_and_equalq(car(cdr(x)), -1, 2) &&
            car(car(cdr(cdr(x)))).equals(POWER) &&
            equaln(car(cdr(car(cdr(cdr(x))))), 2) &&
            is_num_and_equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt((Math.PI * 3.0) / 4.0) : $.multiply(rational(3, 4), Pi);
    }

    // if x == sqrt(3)/2 then return 1/6*pi (30 degrees)
    if (isSqrtThreeOverTwo(x)) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 6.0) : $.multiply(rational(1, 6), Pi);
    }

    // if x == -sqrt(3)/2 then return 5/6*pi (150 degrees)
    if (isMinusSqrtThreeOverTwo(x)) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt((5.0 * Math.PI) / 6.0) : $.multiply(rational(5, 6), Pi);
    }

    if (!is_rat(x)) {
        return items_to_cons(ARCCOS, x);
    }

    // 
    const n = nativeInt($.multiply(x, two));
    switch (n) {
        case -2:
            return $.getDirective(Directive.evaluatingAsFloat) ? piAsFlt : Pi;
        case -1:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt((Math.PI * 2.0) / 3.0) : $.multiply(rational(2, 3), Pi);
        case 0:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 2.0) : $.multiply(half, Pi);
        case 1:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 3.0) : $.multiply(third, Pi);
        case 2:
            return $.getDirective(Directive.evaluatingAsFloat) ? zeroAsFlt : zero;
        default:
            return items_to_cons(ARCCOS, x);
    }
}
