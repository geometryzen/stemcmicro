import { subtract } from '../../calculators/sub/subtract';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { imag } from '../../imag';
import { equaln, is_num_and_gt_zero, is_one_over_two } from '../../is';
import { makeList } from '../../makeList';
import { evaluatingAsFloat } from '../../modes/modes';
import { is_base_of_natural_logarithm } from '../../predicates/is_base_of_natural_logarithm';
import { is_negative } from '../../predicates/is_negative';
import { is_negative_number } from '../../predicates/is_negative_number';
import { is_opr_eq } from '../../predicates/is_opr_eq';
import { ARG, ASSUME_REAL_VARIABLES, PI } from '../../runtime/constants';
import { DynamicConstants } from '../../runtime/defs';
import { is_add, is_multiply, is_power } from '../../runtime/helpers';
import { piAsDouble, zeroAsDouble } from '../../tree/flt/Flt';
import { caddr, cadr } from '../../tree/helpers';
import { half, zero } from '../../tree/rat/Rat';
import { Cons, is_cons, U } from '../../tree/tree';
import { arctan } from '../arctan/arctan';
import { MATH_EXP } from '../exp/MATH_EXP';
import { is_flt } from '../flt/is_flt';
import { is_unaop } from '../helpers/is_unaop';
import { is_imu } from '../imu/is_imu';
import { real } from '../real/real';
import { rect } from '../rect/rect';
import { is_sym } from '../sym/is_sym';

/* arg =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
z

General description
-------------------
Returns the angle of complex z.

*/

/*
 Argument (angle) of complex z

  z    arg(z)
  -    ------

  a    0

  -a    -pi      See note 3 below

  (-1)^a    a pi

  exp(a + i b)  b

  a b    arg(a) + arg(b)

  a + i b    arctan(b/a)

Result by quadrant
    return p1;

  z    arg(z)
  -    ------

  1 + i    1/4 pi

  1 - i    -1/4 pi

  -1 + i    3/4 pi

  -1 - i    -3/4 pi

Notes

  1. Handles mixed polar and rectangular forms, e.g. 1 + exp(i pi/3)

  2. Symbols in z are assumed to be positive and real.

  3. Negative direction adds -pi to angle.

     Example: z = (-1)^(1/3), abs(z) = 1/3 pi, abs(-z) = -2/3 pi

  4. jean-francois.debroux reports that when z=(a+i*b)/(c+i*d) then

    arg(numerator(z)) - arg(denominator(z))

     must be used to get the correct answer. Now the operation is
     automatic.
*/

export function Eval_arg(expr: Cons, $: ExtensionEnv): U {
    // console.lg(`Eval_arg expr => ${expr}`);
    const z = cadr(expr);
    // console.lg(`z => ${z}`);
    const value_of_z = $.valueOf(z);
    // console.lg(`value_of_z => ${value_of_z}`);
    const arg_z = $.arg(value_of_z);
    // console.lg(`arg_z => ${arg_z}`);
    return arg_z;
}

export function yyarg(expr: U, $: ExtensionEnv): U {
    // console.lg(`yyarg expr=${expr}`);
    // case of plain number
    if (is_num_and_gt_zero(expr) || PI.equals(expr)) {
        return is_flt(expr) || $.getModeFlag(evaluatingAsFloat) ? zeroAsDouble : zero;
    }

    if (is_negative_number(expr)) {
        const pi = is_flt(expr) || $.getModeFlag(evaluatingAsFloat) ? piAsDouble : PI;
        return $.negate(pi);
    }

    // you'd think that something like
    // arg(a) is always 0 when a is real but no,
    // arg(a) is pi when a is negative so we have
    // to leave unexpressed
    if (is_sym(expr)) {
        return makeList(ARG, expr);
    }

    // Implementation in which the imaginary unit is it's own object.
    if (is_imu(expr)) {
        return $.multiply(DynamicConstants.Pi($), half);
    }

    const base = cadr(expr);

    // Implementation in which imaginary unit is (power -1 1/2).
    if (is_power(expr) && equaln(base, -1)) {
        // -1 to a power
        return $.multiply(DynamicConstants.Pi($), caddr(expr));
    }

    // (power e X) => imag(X)
    if (is_power(expr) && is_base_of_natural_logarithm(base)) {
        // exponential
        // arg(a^(1/2)) is always equal to 1/2 * arg(a)
        // this can obviously be made more generic TODO
        return imag(caddr(expr), $);
    }

    // (exp X) => imag(X)
    if (is_cons(expr) && is_unaop(expr) && is_opr_eq(expr, MATH_EXP)) {
        const arg = imag(expr.arg, $);
        return arg;
    }

    if (is_power(expr) && is_one_over_two(caddr(expr))) {
        const arg1 = $.arg(cadr(expr));
        return $.multiply(arg1, caddr(expr));
    }


    if (is_multiply(expr)) {
        // product of factors
        return expr.tail().map(function (x) {
            return $.arg(x);
        }).reduce(function (x, y) {
            return $.add(x, y);
        }, zero);
    }

    if (is_cons(expr) && is_add(expr)) {
        return arg_of_sum(expr, $);
    }
    if (!$.isZero($.getBinding(ASSUME_REAL_VARIABLES))) {
        // if we assume all passed values are real
        return zero;
    }

    // if we don't assume all passed values are real, all
    // we con do is to leave unexpressed
    return makeList(ARG, expr);
}

function arg_of_sum(expr: Cons, $: ExtensionEnv): U {
    // console.lg(`arg_of_sum(${expr})`);
    // sum of terms
    const z = rect(expr, $);
    // console.lg(`z => ${z}`);
    const x = real(z, $);
    const y = imag(z, $);
    // console.lg(`x => ${$.toListString(x)}`);
    // console.lg(`y => ${$.toListString(y)}`);
    if ($.isZero(x)) {
        if (is_negative(y)) {
            return $.negate(DynamicConstants.Pi($));
        }
        else {
            return DynamicConstants.Pi($);
        }
    }
    else {
        const arg1 = arctan($.divide(y, x), $);
        if (is_negative(x)) {
            if (is_negative(y)) {
                return subtract(arg1, DynamicConstants.Pi($), $); // quadrant 1 -> 3
            }
            else {
                return $.add(arg1, DynamicConstants.Pi($)); // quadrant 4 -> 2
            }
        }
        return arg1;
    }
}
