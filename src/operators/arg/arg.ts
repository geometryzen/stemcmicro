import { subtract } from '../../calculators/sub/subtract';
import { divide } from '../../helpers/divide';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { equaln, is_num_and_gt_zero, is_one_over_two } from '../../is';
import { evaluatingAsFloat } from '../../modes/modes';
import { is_base_of_natural_logarithm } from '../../predicates/is_base_of_natural_logarithm';
import { is_cons_opr_eq_sym } from '../../predicates/is_cons_opr_eq_sym';
import { is_negative } from '../../predicates/is_negative';
import { is_negative_number } from '../../predicates/is_negative_number';
import { ASSUME_REAL_VARIABLES, PI } from '../../runtime/constants';
import { DynamicConstants } from '../../runtime/defs';
import { is_add, is_multiply, is_power } from '../../runtime/helpers';
import { piAsDouble, zeroAsDouble } from '../../tree/flt/Flt';
import { caddr, cadr } from '../../tree/helpers';
import { half, zero } from '../../tree/rat/Rat';
import { create_sym } from '../../tree/sym/Sym';
import { Cons, is_cons, items_to_cons, U } from '../../tree/tree';
import { arctan } from '../arctan/arctan';
import { MATH_EXP } from '../exp/MATH_EXP';
import { is_flt } from '../flt/is_flt';
import { is_unaop } from '../helpers/is_unaop';
import { imag } from '../imag/imag';
import { is_imu } from '../imu/is_imu';
import { is_pi } from '../pi/is_pi';
import { is_pow } from '../pow/is_pow';
import { is_rat } from '../rat/is_rat';
import { real } from '../real/real';
import { rect } from '../rect/rect';
import { is_sym } from '../sym/is_sym';

export const MATH_ARG = create_sym('arg');

export function define_arg($: ExtensionEnv): void {
    // If we also want to control the name as it appears in the script 
    $.defineFunction(MATH_ARG, function (expr: Cons, $: ExtensionEnv): U {
        const z = cadr(expr);
        // console.lg(`z => ${z}`);
        const value_of_z = $.valueOf(z);
        // console.lg(`value_of_z => ${render_as_sexpr(value_of_z, $)}`);
        const arg_z = arg(value_of_z, $);
        // console.lg(`arg_z => ${render_as_sexpr(arg_z, $)}`);
        return arg_z;
    });
}

export function arg(z: U, $: ExtensionEnv): U {
    // console.lg(`arg => ${render_as_sexpr(z, $)}`);
    if (is_multiply(z)) {
        const argList = z.argList;
        if (argList.length === 2) {
            const lhs = argList.item(0);
            const rhs = argList.item(1);
            if (is_cons(rhs) && is_pow(rhs)) {
                const base = rhs.lhs;
                const expo = rhs.rhs;
                if (is_rat(expo) && expo.isMinusOne()) {
                    // console.lg(`z => ${render_as_infix(z, $)} is in the form a/b`);
                    const numer = lhs; // numerator(z, $);
                    // console.lg(`numer=> ${render_as_sexpr(numer, $)}`);
                    // console.lg(`lhs  => ${render_as_sexpr(lhs, $)}`);
                    const denom = base; // denominator(z, $);
                    // console.lg(`denom=> ${render_as_sexpr(denom, $)}`);
                    // console.lg(`base => ${render_as_sexpr(base, $)}`);
                    if (numer.equals(z)) {
                        // Termination condition to prevent infinite recursion.
                        // I'm allowed to use the MATH_ARG symbol because I'm the arg implementation.
                        return items_to_cons(MATH_ARG, z);
                    }
                    else {
                        return $.subtract(yyarg(numer, $), yyarg(denom, $));
                    }
                }
            }
        }
    }
    return yyarg(z, $);
}

function yyarg(expr: U, $: ExtensionEnv): U {
    // console.lg(`yyarg expr=${expr}`);
    // case of plain number
    if (is_num_and_gt_zero(expr) || is_pi(expr)) {
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
        return items_to_cons(MATH_ARG, expr);
    }

    // Implementation in which the imaginary unit is it's own object.
    if (is_imu(expr)) {
        return $.multiply(DynamicConstants.Pi($), half);
    }

    if (is_power(expr)) {
        const base = cadr(expr);
        // Implementation in which imaginary unit is (power -1 1/2).
        if (equaln(base, -1)) {
            // -1 to a power
            return $.multiply(DynamicConstants.Pi($), caddr(expr));
        }

        // (power e X) => imag(X)
        if (is_base_of_natural_logarithm(base)) {
            // exponential
            // arg(a^(1/2)) is always equal to 1/2 * arg(a)
            // this can obviously be made more generic TODO
            return imag(caddr(expr), $);
        }
    }

    // (exp X) => imag(X)
    if (is_cons(expr) && is_unaop(expr) && is_cons_opr_eq_sym(expr, MATH_EXP)) {
        const arg = imag(expr.arg, $);
        return arg;
    }

    if (is_power(expr) && is_one_over_two(caddr(expr))) {
        const arg1 = arg(cadr(expr), $);
        return $.multiply(arg1, caddr(expr));
    }


    if (is_multiply(expr)) {
        // product of factors
        return expr.tail().map(function (x) {
            return arg(x, $);
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
    return items_to_cons(MATH_ARG, expr);
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
        const arg1 = arctan(divide(y, x, $), $);
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
