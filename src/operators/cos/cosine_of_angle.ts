
import { rational } from '../../bignum';
import { ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from '../../env/ExtensionEnv';
import { nativeInt } from '../../nativeInt';
import { is_negative } from '../../predicates/is_negative';
import { ARCCOS, ARCTAN } from '../../runtime/constants';
import { DynamicConstants } from '../../runtime/defs';
import { wrap_as_flt } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { half, negOne, one, three, two, wrap_as_int, zero } from '../../tree/rat/Rat';
import { car, U } from '../../tree/tree';
import { is_flt } from '../flt/is_flt';


export function cosine_of_angle(x: U, oldExpr: U, $: ExtensionEnv): [TFLAGS, U] {
    // console.log(`cosine_of_angle arg=${render_as_infix(x, $)}`);

    if (car(x).equals(ARCCOS)) {
        return [TFLAG_DIFF, cadr(x)];
    }

    if (is_flt(x)) {
        let d = Math.cos(x.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return [TFLAG_DIFF, wrap_as_flt(d)];
    }

    // cosine function is symmetric, cos(-x) = cos(x)

    // TODO: The question we should be asking is whether the symbol contains a factor that is negative?
    if (is_negative(x)) {
        x = $.negate(x);
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

    const n = nativeInt($.divide($.multiply(x, wrap_as_int(180)), DynamicConstants.Pi($)));

    // console.log(`n=${n}`);

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
