import { is_flt, is_rat } from "@stemcmicro/atoms";
import { Directive } from "@stemcmicro/directive";
import { is_num_and_eq_number, is_num_and_eq_rational, num_to_number } from "@stemcmicro/helpers";
import { car, cdr, is_cons, items_to_cons, U } from "@stemcmicro/tree";
import { rational } from "../../bignum";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { isminusoneoversqrttwo, isMinusSqrtThreeOverTwo, isoneoversqrttwo, isSqrtThreeOverTwo } from "../../is";
import { ARCSIN, POWER } from "../../runtime/constants";
import { is_multiply, is_sin } from "../../runtime/helpers";
import { MATH_PI } from "../../runtime/ns_math";
import { create_flt, zeroAsFlt } from "../../tree/flt/Flt";
import { half, third, two, zero } from "../../tree/rat/Rat";

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
    if (isoneoversqrttwo(x) || (is_multiply(x) && is_num_and_eq_rational(car(cdr(x)), 1, 2) && car(car(cdr(cdr(x)))).equals(POWER) && is_num_and_eq_number(car(cdr(car(cdr(cdr(x))))), 2) && is_num_and_eq_rational(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))) {
        return $.multiply(rational(1, 4), MATH_PI);
    }

    // if x == -1/sqrt(2) then return -1/4*pi (-45 degrees)
    // second if catches the other way of saying it, -sqrt(2)/2
    if (
        isminusoneoversqrttwo(x) ||
        (is_multiply(x) && is_num_and_eq_rational(car(cdr(x)), -1, 2) && car(car(cdr(cdr(x)))).equals(POWER) && is_num_and_eq_number(car(cdr(car(cdr(cdr(x))))), 2) && is_num_and_eq_rational(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 4.0) : $.multiply(rational(-1, 4), MATH_PI);
    }

    // if x == sqrt(3)/2 then return 1/3*pi (60 degrees)
    if (isSqrtThreeOverTwo(x)) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 3.0) : $.multiply(third, MATH_PI);
    }

    // if x == -sqrt(3)/2 then return -1/3*pi (-60 degrees)
    if (isMinusSqrtThreeOverTwo(x)) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 3.0) : $.multiply(rational(-1, 3), MATH_PI);
    }

    if (!is_rat(x)) {
        return items_to_cons(ARCSIN, x);
    }

    const n = num_to_number(x.mul(two));
    switch (n) {
        case -2:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 2.0) : $.multiply(rational(-1, 2), MATH_PI);
        case -1:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 6.0) : $.multiply(rational(-1, 6), MATH_PI);
        case 0:
            return $.getDirective(Directive.evaluatingAsFloat) ? zeroAsFlt : zero;
        case 1:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 6.0) : $.multiply(rational(1, 6), MATH_PI);
        case 2:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 2.0) : $.multiply(half, MATH_PI);
        default:
            return items_to_cons(ARCSIN, x);
    }
}
