import { create_flt, create_rat, half, is_flt, is_rat, third, two, zero, zeroAsFlt } from "@stemcmicro/atoms";
import { Directive } from "@stemcmicro/directive";
import { is_num_and_eq_number, is_num_and_eq_rational, num_to_number } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { car, cdr, is_cons, items_to_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { isMinusSqrtThreeOverTwo, isSqrtThreeOverTwo, is_minus_one_over_sqrt_two, is_one_over_sqrt_two } from "../../is";
import { is_multiply } from "../../runtime/helpers";

const ARCSIN = native_sym(Native.arcsin);
const MATH_PI = native_sym(Native.PI);
const POWER = native_sym(Native.pow);
const SIN = native_sym(Native.sin);

export function arcsin(x: U, $: ExtensionEnv): U {
    if (is_cons(x) && x.opr.equals(SIN)) {
        return x.cdr.arg;
    }

    if (is_flt(x)) {
        return create_flt(Math.asin(x.d));
    }

    // if x == 1/sqrt(2) then return 1/4*pi (45 degrees)
    // second if catches the other way of saying it, sqrt(2)/2
    if (
        is_one_over_sqrt_two(x) ||
        (is_multiply(x) && is_num_and_eq_rational(car(cdr(x)), 1, 2) && car(car(cdr(cdr(x)))).equals(POWER) && is_num_and_eq_number(car(cdr(car(cdr(cdr(x))))), 2) && is_num_and_eq_rational(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.multiply(create_rat(1, 4), MATH_PI);
    }

    // if x == -1/sqrt(2) then return -1/4*pi (-45 degrees)
    // second if catches the other way of saying it, -sqrt(2)/2
    if (
        is_minus_one_over_sqrt_two(x) ||
        (is_multiply(x) && is_num_and_eq_rational(car(cdr(x)), -1, 2) && car(car(cdr(cdr(x)))).equals(POWER) && is_num_and_eq_number(car(cdr(car(cdr(cdr(x))))), 2) && is_num_and_eq_rational(car(cdr(cdr(car(cdr(cdr(x)))))), 1, 2))
    ) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 4.0) : $.multiply(create_rat(-1, 4), MATH_PI);
    }

    // if x == sqrt(3)/2 then return 1/3*pi (60 degrees)
    if (isSqrtThreeOverTwo(x)) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 3.0) : $.multiply(third, MATH_PI);
    }

    // if x == -sqrt(3)/2 then return -1/3*pi (-60 degrees)
    if (isMinusSqrtThreeOverTwo(x)) {
        return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 3.0) : $.multiply(create_rat(-1, 3), MATH_PI);
    }

    if (!is_rat(x)) {
        return items_to_cons(ARCSIN, x);
    }

    const n = num_to_number(x.mul(two));
    switch (n) {
        case -2:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 2.0) : $.multiply(create_rat(-1, 2), MATH_PI);
        case -1:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(-Math.PI / 6.0) : $.multiply(create_rat(-1, 6), MATH_PI);
        case 0:
            return $.getDirective(Directive.evaluatingAsFloat) ? zeroAsFlt : zero;
        case 1:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 6.0) : $.multiply(create_rat(1, 6), MATH_PI);
        case 2:
            return $.getDirective(Directive.evaluatingAsFloat) ? create_flt(Math.PI / 2.0) : $.multiply(half, MATH_PI);
        default:
            return items_to_cons(ARCSIN, x);
    }
}
