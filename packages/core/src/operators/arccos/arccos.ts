import { create_flt, create_rat, half, is_flt, is_rat, piAsFlt, third, two, zero, zeroAsFlt } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { is_multiply, is_negative, is_num_and_eq_number, is_num_and_eq_rational, multiply, negate, num_to_number, subtract } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { cadr, car, cdr, items_to_cons, U } from "@stemcmicro/tree";
import { isMinusSqrtThreeOverTwo, isSqrtThreeOverTwo, is_minus_one_over_sqrt_two, is_one_over_sqrt_two } from "../../is";

const ARCCOS = native_sym(Native.arccos);
const COS = native_sym(Native.cos);
const PI = native_sym(Native.PI);
const POWER = native_sym(Native.pow);

export function arccos(x: U, $: ExprContext): U {
    if (car(x).equals(COS)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        return create_flt(Math.acos(x.d));
    }

    if (is_negative(x)) {
        const negX = negate($, x);
        const theta = $.valueOf(items_to_cons(ARCCOS, negX));
        return subtract($, PI, theta);
    }

    // if x == 1/sqrt(2) then return 1/4*pi (45 degrees)
    // second if catches the other way of saying it, sqrt(2)/2
    if (
        is_one_over_sqrt_two(x) ||
        (is_multiply(x) && is_num_and_eq_rational(car(cdr(x)), 1, 2) && car(car(cdr(cdr(x)))).equals(POWER) && is_num_and_eq_number(car(cdr(car(cdr(cdr(x))))), 2) && is_num_and_eq_rational(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 4.0) : multiply($, create_rat(1, 4), PI);
    }

    // if x == -1/sqrt(2) then return 3/4*pi (135 degrees)
    // second if catches the other way of saying it, -sqrt(2)/2
    if (
        is_minus_one_over_sqrt_two(x) ||
        (is_multiply(x) && is_num_and_eq_rational(car(cdr(x)), -1, 2) && car(car(cdr(cdr(x)))).equals(POWER) && is_num_and_eq_number(car(cdr(car(cdr(cdr(x))))), 2) && is_num_and_eq_rational(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt((Math.PI * 3.0) / 4.0) : multiply($, create_rat(3, 4), PI);
    }

    // if x == sqrt(3)/2 then return 1/6*pi (30 degrees)
    if (isSqrtThreeOverTwo(x)) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 6.0) : multiply($, create_rat(1, 6), PI);
    }

    // if x == -sqrt(3)/2 then return 5/6*pi (150 degrees)
    if (isMinusSqrtThreeOverTwo(x)) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt((5.0 * Math.PI) / 6.0) : multiply($, create_rat(5, 6), PI);
    }

    if (!is_rat(x)) {
        return items_to_cons(ARCCOS, x);
    }

    //
    const n = num_to_number(multiply($, x, two));
    switch (n) {
        case -2:
            return $.getDirective(Directive.evaluatingAsFloat) ? piAsFlt : PI;
        case -1:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt((Math.PI * 2.0) / 3.0) : multiply($, create_rat(2, 3), PI);
        case 0:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 2.0) : multiply($, half, PI);
        case 1:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 3.0) : multiply($, third, PI);
        case 2:
            return $.getDirective(Directive.evaluatingAsFloat) ? zeroAsFlt : zero;
        default:
            return items_to_cons(ARCCOS, x);
    }
}
