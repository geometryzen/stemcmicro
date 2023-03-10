import { rational } from '../../bignum';
import { Directive, ExtensionEnv } from '../../env/ExtensionEnv';
import {
    equaln,
    equalq,
    isminusoneoversqrttwo,
    isMinusSqrtThreeOverTwo,
    isoneoversqrttwo,
    isSqrtThreeOverTwo
} from '../../is';
import { makeList } from '../../makeList';
import { nativeInt } from '../../nativeInt';
import { ARCSIN, PI, POWER } from '../../runtime/constants';
import { is_multiply, is_sin } from '../../runtime/helpers';
import { create_flt, zeroAsFlt } from '../../tree/flt/Flt';
import { half, third, two, zero } from '../../tree/rat/Rat';
import { car, cdr, is_cons, U } from '../../tree/tree';
import { is_flt } from '../flt/is_flt';
import { is_rat } from '../rat/is_rat';

/* arcsin =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse sine of x.

*/
export function arcsin(x: U, $: ExtensionEnv): U {

    // arcsin(sin(x)) => x
    if (is_cons(x) && is_sin(x)) {
        return car(x.cdr);
    }

    if (is_flt(x)) {
        return create_flt(Math.asin(x.d));
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
        return $.multiply(rational(1, 4), PI);
    }

    // if x == -1/sqrt(2) then return -1/4*pi (-45 degrees)
    // second if catches the other way of saying it, -sqrt(2)/2
    if (
        isminusoneoversqrttwo(x) ||
        (is_multiply(x) &&
            equalq(car(cdr(x)), -1, 2) &&
            car(car(cdr(cdr(x)))).equals(POWER) &&
            equaln(car(cdr(car(cdr(cdr(x))))), 2) &&
            equalq(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.getNativeDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 4.0) : $.multiply(rational(-1, 4), PI);
    }

    // if x == sqrt(3)/2 then return 1/3*pi (60 degrees)
    if (isSqrtThreeOverTwo(x)) {
        return $.getNativeDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 3.0) : $.multiply(third, PI);
    }

    // if x == -sqrt(3)/2 then return -1/3*pi (-60 degrees)
    if (isMinusSqrtThreeOverTwo(x)) {
        return $.getNativeDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 3.0) : $.multiply(rational(-1, 3), PI);
    }

    if (!is_rat(x)) {
        return makeList(ARCSIN, x);
    }

    const n = nativeInt(x.mul(two));
    switch (n) {
        case -2:
            return $.getNativeDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 2.0) : $.multiply(rational(-1, 2), PI);
        case -1:
            return $.getNativeDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 6.0) : $.multiply(rational(-1, 6), PI);
        case 0:
            return $.getNativeDirective(Directive.evaluatingAsFloat) ? zeroAsFlt : zero;
        case 1:
            return $.getNativeDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 6.0) : $.multiply(rational(1, 6), PI);
        case 2:
            return $.getNativeDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 2.0) : $.multiply(half, PI);
        default:
            return makeList(ARCSIN, x);
    }
}
