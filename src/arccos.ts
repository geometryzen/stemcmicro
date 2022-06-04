import { rational } from './bignum';
import { ExtensionEnv } from './env/ExtensionEnv';
import {
    equaln,
    equalq,
    isminusoneoversqrttwo,
    isMinusSqrtThreeOverTwo,
    isoneoversqrttwo,
    isSqrtThreeOverTwo
} from './is';
import { makeList } from './makeList';
import { nativeInt } from './nativeInt';
import { ARCCOS, COS, PI, POWER } from './runtime/constants';
import { defs, DynamicConstants } from './runtime/defs';
import { is_multiply } from './runtime/helpers';
import { wrap_as_flt } from './tree/flt/Flt';
import { is_flt } from './operators/flt/is_flt';
import { cadr } from './tree/helpers';
import { is_rat } from './operators/rat/is_rat';
import { half, third, two } from './tree/rat/Rat';
import { car, cdr, U } from './tree/tree';

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
        return defs.evaluatingAsFloats
            ? wrap_as_flt(Math.PI / 4.0)
            : $.multiply(rational(1, 4), PI);
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
        return defs.evaluatingAsFloats
            ? wrap_as_flt((Math.PI * 3.0) / 4.0)
            : $.multiply(rational(3, 4), PI);
    }

    // if x == sqrt(3)/2 then return 1/6*pi (30 degrees)
    if (isSqrtThreeOverTwo(x)) {
        return defs.evaluatingAsFloats
            ? wrap_as_flt(Math.PI / 6.0)
            : $.multiply(rational(1, 6), PI);
    }

    // if x == -sqrt(3)/2 then return 5/6*pi (150 degrees)
    if (isMinusSqrtThreeOverTwo(x)) {
        return defs.evaluatingAsFloats
            ? wrap_as_flt((5.0 * Math.PI) / 6.0)
            : $.multiply(rational(5, 6), PI);
    }

    if (!is_rat(x)) {
        return makeList(ARCCOS, x);
    }

    const n = nativeInt($.multiply(x, two));
    switch (n) {
        case -2:
            return DynamicConstants.Pi();
        case -1:
            return defs.evaluatingAsFloats ? wrap_as_flt((Math.PI * 2.0) / 3.0) : $.multiply(rational(2, 3), PI);
        case 0:
            return defs.evaluatingAsFloats ? wrap_as_flt(Math.PI / 2.0) : $.multiply(half, PI);
        case 1:
            return defs.evaluatingAsFloats ? wrap_as_flt(Math.PI / 3.0) : $.multiply(third, PI);
        case 2:
            return DynamicConstants.Zero();
        default:
            return makeList(ARCCOS, x);
    }
}
