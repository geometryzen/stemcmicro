import { create_flt, create_int, half, is_flt, negOne, one, three, two, zero } from "@stemcmicro/atoms";
import { divide, is_negative, num_to_number } from "@stemcmicro/helpers";
import { cadr, car, U } from "@stemcmicro/tree";
import { rational } from "../../bignum";
import { ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { ARCCOS, ARCTAN } from "../../runtime/constants";
import { DynamicConstants } from "../../runtime/defs";

export function cosine_of_angle(x: U, oldExpr: U, $: ExtensionEnv): [TFLAGS, U] {
    // console.lg(`cosine_of_angle arg=${render_as_infix(x, $)}`);

    if (car(x).equals(ARCCOS)) {
        return [TFLAG_DIFF, cadr(x)];
    }

    if (is_flt(x)) {
        let d = Math.cos(x.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return [TFLAG_DIFF, create_flt(d)];
    }

    // cosine function is symmetric, cos(-x) = cos(x)

    if (is_negative(x)) {
        return [TFLAG_DIFF, $.cos($.negate(x))];
    }

    // cos(arctan(x)) = 1 / sqrt(1 + x^2)

    // see p. 173 of the CRC Handbook of Mathematical Sciences

    if (car(x).equals(ARCTAN)) {
        const base = $.add(one, $.power(cadr(x), two));
        return [TFLAG_DIFF, $.power(base, rational(-1, 2))];
    }

    // multiply by 180/pi to go from radians to degrees.
    // we go from radians to degrees because it's much
    // easier to calculate symbolic results of most (not all) "classic"
    // angles (e.g. 30,45,60...) if we calculate the degrees
    // and the we do a switch on that.
    // Alternatively, we could look at the fraction of pi
    // (e.g. 60 degrees is 1/3 pi) but that's more
    // convoluted as we'd need to look at both numerator and
    // denominator.

    const x_times_180 = $.multiply(x, create_int(180));
    const PI = DynamicConstants.PI($);
    const n = num_to_number(divide(x_times_180, PI, $));

    // most "good" (i.e. compact) trigonometric results
    // happen for a round number of degrees. There are some exceptions
    // though, e.g. 22.5 degrees, which we don't capture here.
    if (n < 0 || isNaN(n)) {
        return [TFLAG_NONE, oldExpr];
    }

    switch (n % 360) {
        case 90:
        case 270:
            return [TFLAG_DIFF, zero];
        case 60:
        case 300:
            return [TFLAG_DIFF, half];
        case 120:
        case 240:
            return [TFLAG_DIFF, rational(-1, 2)];
        case 45:
        case 315:
            return [TFLAG_DIFF, $.multiply(half, $.power(two, half))];
        case 135:
        case 225:
            return [TFLAG_DIFF, $.multiply(rational(-1, 2), $.power(two, half))];
        case 30:
        case 330:
            return [TFLAG_DIFF, $.multiply(half, $.power(three, half))];
        case 150:
        case 210:
            return [TFLAG_DIFF, $.multiply(rational(-1, 2), $.power(three, half))];
        case 0:
            return [TFLAG_DIFF, one];
        case 180:
            return [TFLAG_DIFF, negOne];
        default:
            return [TFLAG_NONE, oldExpr];
    }
}
