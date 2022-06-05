import { rational } from '../../bignum';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { is_negative } from '../../is';
import { is_multiple_of_pi } from '../../is_multiple_of_pi';
import { makeList } from '../../makeList';
import { nativeInt } from '../../nativeInt';
import { ARCSIN, ARCTAN, SIN } from '../../runtime/constants';
import { DynamicConstants } from '../../runtime/defs';
import { is_add } from '../../runtime/helpers';
import { wrap_as_flt } from '../../tree/flt/Flt';
import { is_flt } from '../flt/is_flt';
import { cadr } from '../../tree/helpers';
import { half, wrap_as_int, negOne, one, three, two, zero } from '../../tree/rat/Rat';
import { car, cdr, is_cons, U } from '../../tree/tree';

export function sine(p1: U, $: ExtensionEnv): U {
    if (is_add(p1)) {
        // sin of a sum can be further decomposed into
        //sin(alpha+beta) = sin(alpha)*cos(beta)+sin(beta)*cos(alpha)
        return sine_of_angle_sum(p1, $);
    }
    return sine_of_angle(p1, $);
}
// console.lg "sine end ---- "

// Use angle sum formula for special angles.

// decompose sum sin(alpha+beta) into
// sin(alpha)*cos(beta)+sin(beta)*cos(alpha)
function sine_of_angle_sum(p1: U, $: ExtensionEnv): U {
    let p2 = cdr(p1);
    while (is_cons(p2)) {
        const B = car(p2);
        if (is_multiple_of_pi(B, $)) {
            const A = $.subtract(p1, B);
            return $.add($.multiply(sine(A, $), $.cos(B)), $.multiply($.cos(A), sine(B, $)));
        }
        p2 = cdr(p2);
    }
    return sine_of_angle(p1, $);
}

function sine_of_angle(p1: U, $: ExtensionEnv): U {
    if (car(p1).equals(ARCSIN)) {
        return cadr(p1);
    }

    if (is_flt(p1)) {
        let d = Math.sin(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return wrap_as_flt(d);
    }

    // sine function is antisymmetric, sin(-x) = -sin(x)
    if (is_negative(p1)) {
        return $.negate(sine($.negate(p1), $));
    }

    // sin(arctan(x)) = x / sqrt(1 + x^2)

    // see p. 173 of the CRC Handbook of Mathematical Sciences
    if (car(p1).equals(ARCTAN)) {
        return $.multiply(
            cadr(p1),
            $.power($.add(one, $.power(cadr(p1), two)), rational(-1, 2))
        );
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
    // TODO: DynamicConstants.Pi
    const n = nativeInt($.divide($.multiply(p1, wrap_as_int(180)), DynamicConstants.Pi($)));

    // most "good" (i.e. compact) trigonometric results
    // happen for a round number of degrees. There are some exceptions
    // though, e.g. 22.5 degrees, which we don't capture here.
    if (n < 0 || isNaN(n)) {
        return makeList(SIN, p1);
    }

    // values of some famous angles. Many more here:
    // https://en.wikipedia.org/wiki/Trigonometric_constants_expressed_in_real_radicals
    switch (n % 360) {
        case 0:
        case 180:
            return zero;
        case 30:
        case 150:
            return half;
        case 210:
        case 330:
            return rational(-1, 2);
        case 45:
        case 135:
            return $.multiply(half, $.power(two, half));
        case 225:
        case 315:
            return $.multiply(rational(-1, 2), $.power(two, half));
        case 60:
        case 120:
            return $.multiply(half, $.power(three, half));
        case 240:
        case 300:
            return $.multiply(rational(-1, 2), $.power(three, half));
        case 90:
            return one;
        case 270:
            return negOne;
        default:
            return makeList(SIN, p1);
    }
}
