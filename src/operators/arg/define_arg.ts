import { subtract } from '../../calculators/sub/subtract';
import { Directive, ExtensionEnv } from '../../env/ExtensionEnv';
import { equaln, is_num_and_equal_one_half, is_num_and_gt_zero } from '../../is';
import { Native } from '../../native/Native';
import { native_sym } from '../../native/native_sym';
import { is_base_of_natural_logarithm } from '../../predicates/is_base_of_natural_logarithm';
import { is_cons_opr_eq_sym } from '../../predicates/is_cons_opr_eq_sym';
import { is_negative } from '../../predicates/is_negative';
import { is_num_and_negative } from '../../predicates/is_negative_number';
import { ASSUME_REAL_VARIABLES, PI } from '../../runtime/constants';
import { DynamicConstants } from '../../runtime/defs';
import { is_add, is_multiply, is_power } from '../../runtime/helpers';
import { Err } from '../../tree/err/Err';
import { piAsFlt, zeroAsFlt } from '../../tree/flt/Flt';
import { caddr, cadr } from '../../tree/helpers';
import { half, zero } from '../../tree/rat/Rat';
import { Cons, is_cons, items_to_cons, U } from '../../tree/tree';
import { MATH_EXP } from '../exp/MATH_EXP';
import { is_flt } from '../flt/is_flt';
import { is_unaop } from '../helpers/is_unaop';
import { imag } from '../imag/imag';
import { is_imu } from '../imu/is_imu';
import { is_pi } from '../pi/is_pi';
import { is_pow } from '../pow/is_pow';
import { is_rat } from '../rat/is_rat';
import { real } from '../real/real';
import { is_sym } from '../sym/is_sym';

export const ARG = native_sym(Native.arg);
export const IMAG = native_sym(Native.imag);
export const REAL = native_sym(Native.real);

/**
 * Example of inverting the registration 
 */
export function define_arg($: ExtensionEnv): void {
    // If we also want to control the name as it appears in the script 
    $.defineConsTransformer(ARG, function (expr: Cons, $: ExtensionEnv): U {
        const z = cadr(expr);
        // console.lg("z", $.toInfixString(z));
        const value_of_z = $.valueOf(z);
        // console.lg("value_of_z", $.toInfixString(value_of_z));
        const arg_z = arg(value_of_z, $);
        // console.lg(`arg_z => ${render_as_sexpr(arg_z, $)}`);
        return arg_z;
    });
}

function arg(z: U, $: ExtensionEnv): U {
    // TODO: arg is being computed here by immediately going to real and imag parts.
    // If z is in the form of a (power base expo) then it can make sense to equate to a polar form
    // and solve for theta that way. The implementation of real is already using that approach.
    // console.lg(`arg`, $.toSExprString(z));
    const y = $.imag(z);
    // const y = imag(z, $);
    // console.lg(`y`, $.toInfixString(y));
    const x = $.real(z);
    // const x = real(z, $);
    // console.lg(`x`, $.toInfixString(x));
    // TODO: handle the undefined case when both x and y are zero.
    if ($.is_zero(x)) {
        if ($.is_zero(y)) {
            // Undefined
            return new Err(items_to_cons(ARG, $.add(x, y)));
        }
        else {
            const k = is_negative(y) ? half.neg() : half;
            const pi = DynamicConstants.Pi($);
            return $.multiply(k, pi);
        }
        /*
        else if (is_negative(y)) {
            return $.negate(pi);
        }
        else {
            return divide(pi,two,$);
        }
        */
    }
    else {
        if (is_negative(x)) {
            const pi = DynamicConstants.Pi($);
            if (is_negative(y)) {
                return $.subtract($.arctan($.divide(y, x)), pi);
            }
            else {
                const lhs = $.arctan($.divide(y, x));
                const rhs = pi;
                const sum = $.add(lhs, rhs);
                return sum;
            }
        }
        else {
            // TODO: We're getting arg(x) is zero because of assumptions that x is not negative.
            return $.arctan($.divide(y, x));
        }
    }

}

export function arg_old(z: U, $: ExtensionEnv): U {
    // console.lg("arg", $.toInfixString(z));
    if (is_multiply(z)) {
        const argList = z.argList;
        if (argList.length === 2) {
            const lhs = argList.item(0);
            const rhs = argList.item(1);
            if (is_cons(rhs) && is_pow(rhs)) {
                const base = rhs.base;
                const expo = rhs.expo;
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
                        return items_to_cons(ARG, z);
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
    // console.lg("yyarg", $.toSExprString(expr));
    // case of plain number
    if (is_num_and_gt_zero(expr) || is_pi(expr)) {
        return is_flt(expr) || $.getDirective(Directive.evaluatingAsFloat) ? zeroAsFlt : zero;
    }

    if (is_num_and_negative(expr)) {
        const pi = is_flt(expr) || $.getDirective(Directive.evaluatingAsFloat) ? piAsFlt : PI;
        return $.negate(pi);
    }

    // you'd think that something like
    // arg(a) is always 0 when a is real but no,
    // arg(a) is pi when a is negative so we have
    // to leave unexpressed
    if (is_sym(expr)) {
        return items_to_cons(ARG, expr);
    }

    // Implementation in which the imaginary unit is it's own object.
    if (is_imu(expr)) {
        return $.multiply(DynamicConstants.Pi($), half);
    }

    if (is_power(expr)) {
        const base = expr.base;
        // Implementation in which imaginary unit is (expt -1 1/2).
        if (equaln(base, -1)) {
            // -1 to a power
            return $.multiply(DynamicConstants.Pi($), expr.expo);
        }

        // (expt e X) => imag(X)
        if (is_base_of_natural_logarithm(base)) {
            // exponential
            // arg(a^(1/2)) is always equal to 1/2 * arg(a)
            // this can obviously be made more generic TODO
            return imag(expr.expo, $);
        }
    }

    // (exp X) => imag(X)
    if (is_cons(expr) && is_unaop(expr) && is_cons_opr_eq_sym(expr, MATH_EXP)) {
        const arg = imag(expr.arg, $);
        return arg;
    }

    if (is_power(expr) && is_num_and_equal_one_half(caddr(expr))) {
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
        return arg_of_sum_old(expr, $);
    }

    if (!$.is_zero($.getSymbolValue(ASSUME_REAL_VARIABLES))) {
        // if we assume all passed values are real
        return zero;
    }

    // if we don't assume all passed values are real, all
    // we con do is to leave unexpressed
    return items_to_cons(ARG, expr);
}

function arg_of_sum_old(expr: Cons, $: ExtensionEnv): U {
    // console.lg(`arg_of_sum(${expr})`);
    // sum of terms
    const z = $.rect(expr);
    // console.lg(`z => ${z}`);
    const x = real(z, $);
    const y = imag(z, $);
    // console.lg(`x => ${$.toListString(x)}`);
    // console.lg(`y => ${$.toListString(y)}`);
    if ($.is_zero(x)) {
        if (is_negative(y)) {
            return $.negate(DynamicConstants.Pi($));
        }
        else {
            return DynamicConstants.Pi($);
        }
    }
    else {
        const arg1 = $.arctan($.divide(y, x));
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
