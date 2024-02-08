import { create_int, negOne, one, zero } from 'math-expression-atoms';
import { rational } from '../../bignum';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { divide } from '../../helpers/divide';
import { items_to_cons } from '../../makeList';
import { nativeInt } from '../../nativeInt';
import { is_negative } from '../../predicates/is_negative';
import { ARCTAN, TAN } from '../../runtime/constants';
import { DynamicConstants } from '../../runtime/defs';
import { create_flt } from '../../tree/flt/Flt';
import { cadr } from '../../tree/helpers';
import { half, third, three } from '../../tree/rat/Rat';
import { car, Cons, U } from '../../tree/tree';
import { is_flt } from '../flt/is_flt';

// Tangent function of numerical and symbolic arguments
export function Eval_tan(expr: Cons, $: ExtensionEnv): U {
    const result = tangent($.valueOf(cadr(expr)), $);
    return result;
}

function tangent(p1: U, $: ExtensionEnv): U {
    if (car(p1).equals(ARCTAN)) {
        return cadr(p1);
    }

    if (is_flt(p1)) {
        let d = Math.tan(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return create_flt(d);
    }

    // tan function is antisymmetric, tan(-x) = -tan(x)
    if (is_negative(p1)) {
        return $.negate(tangent($.negate(p1), $));
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
    const n = nativeInt(divide($.multiply(p1, create_int(180)), DynamicConstants.PI($), $));

    // most "good" (i.e. compact) trigonometric results
    // happen for a round number of degrees. There are some exceptions
    // though, e.g. 22.5 degrees, which we don't capture here.
    if (n < 0 || isNaN(n)) {
        return items_to_cons(TAN, p1);
    }

    switch (n % 360) {
        case 0:
        case 180:
            return zero;
        case 30:
        case 210:
            return $.multiply(third, $.power(three, half));
        case 150:
        case 330:
            return $.multiply(rational(-1, 3), $.power(three, half));
        case 45:
        case 225:
            return one;
        case 135:
        case 315:
            return negOne;
        case 60:
        case 240:
            return $.power(three, half);
        case 120:
        case 300:
            return $.negate($.power(three, half));
        default:
            return items_to_cons(TAN, p1);
    }
}
