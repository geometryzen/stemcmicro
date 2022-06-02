
import { rational } from '../../bignum';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { is_negative } from '../../is';
import { makeList } from '../../makeList';
import { nativeInt } from '../../nativeInt';
import { ARCCOS, ARCTAN, COS } from '../../runtime/constants';
import { DynamicConstants } from '../../runtime/defs';
import { flt } from '../../tree/flt/Flt';
import { is_flt } from '../../tree/flt/is_flt';
import { cadr } from '../../tree/helpers';
import { half, integer, negOne, one, three, two, zero } from '../../tree/rat/Rat';
import { car, U } from '../../tree/tree';


export function cosine_of_angle(x: U, $: ExtensionEnv): U {
    // console.log(`cosine_of_angle x=${print_expr(x, $)}`);

    if (car(x).equals(ARCCOS)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        let d = Math.cos(x.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return flt(d);
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
        return $.power(base, rational(-1, 2));
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

    const n = nativeInt($.divide($.multiply(x, integer(180)), DynamicConstants.Pi()));

    // console.log(`n=${n}`);

    // most "good" (i.e. compact) trigonometric results
    // happen for a round number of degrees. There are some exceptions
    // though, e.g. 22.5 degrees, which we don't capture here.
    if (n < 0 || isNaN(n)) {
        return makeList(COS, x);
    }

    switch (n % 360) {
        case 90:
        case 270:
            return zero;
        case 60:
        case 300:
            return half;
        case 120:
        case 240:
            return rational(-1, 2);
        case 45:
        case 315:
            return $.multiply(half, $.power(two, half));
        case 135:
        case 225:
            return $.multiply(rational(-1, 2), $.power(two, half));
        case 30:
        case 330:
            return $.multiply(half, $.power(three, half));
        case 150:
        case 210:
            return $.multiply(rational(-1, 2), $.power(three, half));
        case 0:
            return one;
        case 180:
            return negOne;
        default:
            return makeList(COS, x);
    }
}
