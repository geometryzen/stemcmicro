import { rational } from '../../bignum';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import {
    equaln,
    equalq,
    isminusoneoversqrttwo,
    isMinusSqrtThreeOverTwo,
    isoneoversqrttwo,
    isSqrtThreeOverTwo
} from '../../is';
import { makeList } from '../../makeList';
import { evaluatingAsFloat } from '../../modes/modes';
import { nativeInt } from '../../nativeInt';
import { is_flt } from '../flt/is_flt';
import { is_rat } from '../rat/is_rat';
import { ARCCOS, COS, PI, POWER } from '../../runtime/constants';
import { is_multiply } from '../../runtime/helpers';
import { piAsDouble, wrap_as_flt, zeroAsDouble } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { half, third, two, zero } from '../../tree/rat/Rat';
import { car, cdr, U } from '../../tree/tree';

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
        return wrap_as_flt(Math.acos(x.d));
    }

    // if x == 1/sqrt(2) then return 1/4*pi (45 degrees)
    // second if catches the other way of saying it, sqrt(2)/2
    if (
        isoneoversqrttwo(x) ||
        (is_multiply(x) &&
            equalq(car(cdr(x)), 1, 2) &&
            car(car(cdr(cdr(x)))).equals(POWER) &&
            equaln(car(cdr(car(cdr(cdr(x))))), 2) &&
            equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.getModeFlag(evaluatingAsFloat) ? wrap_as_flt(Math.PI / 4.0) : $.multiply(rational(1, 4), PI);
    }

    // if x == -1/sqrt(2) then return 3/4*pi (135 degrees)
    // second if catches the other way of saying it, -sqrt(2)/2
    if (
        isminusoneoversqrttwo(x) ||
        (is_multiply(x) &&
            equalq(car(cdr(x)), -1, 2) &&
            car(car(cdr(cdr(x)))).equals(POWER) &&
            equaln(car(cdr(car(cdr(cdr(x))))), 2) &&
            equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.getModeFlag(evaluatingAsFloat) ? wrap_as_flt((Math.PI * 3.0) / 4.0) : $.multiply(rational(3, 4), PI);
    }

    // if x == sqrt(3)/2 then return 1/6*pi (30 degrees)
    if (isSqrtThreeOverTwo(x)) {
        return $.getModeFlag(evaluatingAsFloat) ? wrap_as_flt(Math.PI / 6.0) : $.multiply(rational(1, 6), PI);
    }

    // if x == -sqrt(3)/2 then return 5/6*pi (150 degrees)
    if (isMinusSqrtThreeOverTwo(x)) {
        return $.getModeFlag(evaluatingAsFloat) ? wrap_as_flt((5.0 * Math.PI) / 6.0) : $.multiply(rational(5, 6), PI);
    }

    if (!is_rat(x)) {
        return makeList(ARCCOS, x);
    }

    const n = nativeInt($.multiply(x, two));
    switch (n) {
        case -2:
            return $.getModeFlag(evaluatingAsFloat) ? piAsDouble : PI;
        case -1:
            return $.getModeFlag(evaluatingAsFloat) ? wrap_as_flt((Math.PI * 2.0) / 3.0) : $.multiply(rational(2, 3), PI);
        case 0:
            return $.getModeFlag(evaluatingAsFloat) ? wrap_as_flt(Math.PI / 2.0) : $.multiply(half, PI);
        case 1:
            return $.getModeFlag(evaluatingAsFloat) ? wrap_as_flt(Math.PI / 3.0) : $.multiply(third, PI);
        case 2:
            return $.getModeFlag(evaluatingAsFloat) ? zeroAsDouble : zero;
        default:
            return makeList(ARCCOS, x);
    }
}
