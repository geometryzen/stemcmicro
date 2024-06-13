import { create_flt, create_int, half, is_flt, negOne, one, three, two, zero } from "@stemcmicro/atoms";
import { divide, is_add, is_negative, num_to_number } from "@stemcmicro/helpers";
import { cadr, car, Cons, is_cons, U } from "@stemcmicro/tree";
import { rational } from "../../bignum";
import { ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { is_multiple_of_pi } from "../../is_multiple_of_pi";
import { ARCSIN, ARCTAN } from "../../runtime/constants";
import { DynamicConstants } from "../../runtime/defs";

export function eval_sin(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        const head = argList.head;
        try {
            const x = $.valueOf(head);
            try {
                if (is_add(x)) {
                    return sine_of_angle_sum(x, expr, $)[1];
                }
                return sine_of_angle(x, expr, $)[1];
            } finally {
                x.release();
            }
        } finally {
            head.release();
        }
    } finally {
        argList.release();
    }
}

export function transform_sin(x: U, origExpr: U, $: ExtensionEnv): [TFLAGS, U] {
    if (is_add(x)) {
        // sin of a sum can be further decomposed into
        //sin(alpha+beta) = sin(alpha)*cos(beta)+sin(beta)*cos(alpha)
        return sine_of_angle_sum(x, origExpr, $);
    }
    return sine_of_angle(x, origExpr, $);
}

/**
 * Note that this function does not perform an unconditional expansion.
 * Rather, it detects terms which are multiples of pi to perform simplifications.
 */
function sine_of_angle_sum(addExpr: Cons, oldExpr: U, $: ExtensionEnv): [TFLAGS, U] {
    // console.lg("sine_of_angle_sum", $.toInfixString(addExpr));
    let argList = addExpr.argList;
    while (is_cons(argList)) {
        const B = argList.head;
        if (is_multiple_of_pi(B, $)) {
            const A = $.subtract(addExpr, B);
            return [TFLAG_DIFF, $.add($.multiply($.sin(A), $.cos(B)), $.multiply($.cos(A), $.sin(B)))];
        }
        argList = argList.argList;
    }
    return sine_of_angle(addExpr, oldExpr, $);
}

function sine_of_angle(x: U, oldExpr: U, $: ExtensionEnv): [TFLAGS, U] {
    // console.lg("sine_of_angle", $.toInfixString(x));
    if (car(x).equals(ARCSIN)) {
        return [TFLAG_DIFF, cadr(x)];
    }

    if (is_flt(x)) {
        let d = Math.sin(x.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return [TFLAG_DIFF, create_flt(d)];
    }

    // sine function is antisymmetric, sin(-x) = -sin(x)
    if (is_negative(x)) {
        return [TFLAG_DIFF, $.negate($.sin($.negate(x)))];
    }

    // sin(arctan(x)) = x / sqrt(1 + x^2)

    // see p. 173 of the CRC Handbook of Mathematical Sciences
    if (car(x).equals(ARCTAN)) {
        return [TFLAG_DIFF, $.multiply(cadr(x), $.power($.add(one, $.power(cadr(x), two)), rational(-1, 2)))];
    }

    return sin_special_angles(x, oldExpr, $);
}

export function sin_special_angles(x: U, oldExpr: U, $: ExtensionEnv): [TFLAGS, U] {
    // multiply by 180/pi to go from radians to degrees.
    // we go from radians to degrees because it's much
    // easier to calculate symbolic results of most (not all) "classic"
    // angles (e.g. 30,45,60...) if we calculate the degrees
    // and the we do a switch on that.
    // Alternatively, we could look at the fraction of pi
    // (e.g. 60 degrees is 1/3 pi) but that's more
    // convoluted as we'd need to look at both numerator and
    // denominator.
    const n = num_to_number(divide($.multiply(x, create_int(180)), DynamicConstants.PI($), $));

    // most "good" (i.e. compact) trigonometric results
    // happen for a round number of degrees. There are some exceptions
    // though, e.g. 22.5 degrees, which we don't capture here.
    if (n < 0 || isNaN(n)) {
        return [TFLAG_NONE, oldExpr];
    }

    // values of some famous angles. Many more here:
    // https://en.wikipedia.org/wiki/Trigonometric_constants_expressed_in_real_radicals
    switch (n % 360) {
        case 0:
        case 180:
            return [TFLAG_DIFF, zero];
        case 30:
        case 150:
            return [TFLAG_DIFF, half];
        case 210:
        case 330:
            return [TFLAG_DIFF, rational(-1, 2)];
        case 45:
        case 135:
            return [TFLAG_DIFF, $.multiply(half, $.power(two, half))];
        case 225:
        case 315:
            return [TFLAG_DIFF, $.multiply(rational(-1, 2), $.power(two, half))];
        case 60:
        case 120:
            return [TFLAG_DIFF, $.multiply(half, $.power(three, half))];
        case 240:
        case 300:
            return [TFLAG_DIFF, $.multiply(rational(-1, 2), $.power(three, half))];
        case 90:
            return [TFLAG_DIFF, one];
        case 270:
            return [TFLAG_DIFF, negOne];
        default:
            return [TFLAG_NONE, oldExpr];
    }
}
