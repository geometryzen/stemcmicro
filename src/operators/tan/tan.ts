import { create_flt, create_int, is_flt, negOne, one, zero } from 'math-expression-atoms';
import { ExprContext } from 'math-expression-context';
import { car, Cons, items_to_cons, U } from 'math-expression-tree';
import { rational } from '../../bignum';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { divide } from '../../helpers/divide';
import { multiply } from '../../helpers/multiply';
import { negate } from '../../helpers/negate';
import { power } from '../../helpers/power';
import { nativeInt } from '../../nativeInt';
import { is_negative } from '../../predicates/is_negative';
import { ARCTAN, TAN } from '../../runtime/constants';
import { DynamicConstants } from '../../runtime/defs';
import { cadr } from '../../tree/helpers';
import { half, third, three } from '../../tree/rat/Rat';

// Tangent function of numerical and symbolic arguments
export function eval_tan(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        const head = argList.head;
        try {
            const x = $.valueOf(head);
            try {
                return tangent(x, $);
            }
            finally {
                x.release();
            }
        }
        finally {
            head.release();
        }
    }
    finally {
        argList.release();
    }
}

function tangent(x: U, $: ExprContext): U {
    if (car(x).equals(ARCTAN)) {
        return cadr(x);
    }

    if (is_flt(x)) {
        let d = Math.tan(x.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return create_flt(d);
    }

    // tan function is antisymmetric, tan(-x) = -tan(x)
    if (is_negative(x)) {
        return negate($, tangent(negate($, x), $));
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
    const degrees = radians_to_degrees(x, $);

    // most "good" (i.e. compact) trigonometric results
    // happen for a round number of degrees. There are some exceptions
    // though, e.g. 22.5 degrees, which we don't capture here.
    if (degrees < 0 || isNaN(degrees)) {
        return items_to_cons(TAN, x);
    }

    switch (degrees % 360) {
        case 0:
        case 180:
            return zero;
        case 30:
        case 210:
            return multiply($, third, power($, three, half));
        case 150:
        case 330:
            return multiply($, rational(-1, 3), power($, three, half));
        case 45:
        case 225:
            return one;
        case 135:
        case 315:
            return negOne;
        case 60:
        case 240:
            return power($, three, half);
        case 120:
        case 300:
            return negate($, power($, three, half));
        default:
            return items_to_cons(TAN, x);
    }
}

function radians_to_degrees(radians: U, $: ExprContext): number {
    const times_180 = multiply($, radians, create_int(180));
    try {
        const degrees = divide(times_180, DynamicConstants.PI($), $);
        try {
            return nativeInt(degrees);
        }
        finally {
            degrees.release();
        }
    }
    finally {
        times_180.release();
    }
}

