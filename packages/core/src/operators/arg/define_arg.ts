import { is_flt, is_sym } from "@stemcmicro/atoms";
import { Directive } from "@stemcmicro/directive";
import { is_num_and_eq_one_half } from "@stemcmicro/helpers";
import { is_add, is_base_of_natural_logarithm, is_cons_opr_eq_sym, is_multiply, is_num_and_eq_number, is_num_and_negative, is_pi, is_power } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, is_cons, items_to_cons, U } from "@stemcmicro/tree";
import { subtract } from "../../calculators/sub/subtract";
import { stack_arg } from "../../eigenmath/eigenmath";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { StackU } from "../../env/StackU";
import { hook_create_err } from "../../hooks/hook_create_err";
import { is_num_and_gt_zero } from "../../is";
import { is_negative } from "../../predicates/is_negative";
import { DynamicConstants } from "../../runtime/defs";
import { MATH_PI } from "../../runtime/ns_math";
import { piAsFlt, zeroAsFlt } from "../../tree/flt/Flt";
import { caddr, cadr } from "../../tree/helpers";
import { half, zero } from "../../tree/rat/Rat";
import { MATH_EXP } from "../exp/MATH_EXP";
import { is_unaop } from "../helpers/is_unaop";
import { im } from "../imag/imag";
import { is_imu } from "../imu/is_imu";
import { re } from "../real/real";

export const ARG = native_sym(Native.arg);
export const IM = native_sym(Native.imag);
export const RE = native_sym(Native.real);

/**
 * Example of inverting the registration
 */
export function define_arg($: ExtensionEnv): void {
    // If we also want to control the name as it appears in the script
    $.defineEvalFunction(ARG, function (expr: Cons, $: ExtensionEnv): U {
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
    const y = $.im(z);
    const x = $.re(z);
    // TODO: handle the undefined case when both x and y are zero.
    if ($.iszero(x)) {
        if ($.iszero(y)) {
            // Undefined
            return hook_create_err(items_to_cons(ARG, $.add(x, y)));
        } else {
            const k = is_negative(y) ? half.neg() : half;
            const pi = DynamicConstants.PI($);
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
    } else {
        if (is_negative(x)) {
            const pi = DynamicConstants.PI($);
            if (is_negative(y)) {
                return $.subtract($.arctan($.divide(y, x)), pi);
            } else {
                const lhs = $.arctan($.divide(y, x));
                const rhs = pi;
                const sum = $.add(lhs, rhs);
                return sum;
            }
        } else {
            // TODO: We're getting arg(x) is zero because of assumptions that x is not negative.
            return $.arctan($.divide(y, x));
        }
    }
}

export function eval_arg(expr: Cons, env: ExtensionEnv): U {
    const $ = new StackU();
    stack_arg(expr, env, env, $);
    return $.pop();
}

export function yyarg(expr: U, $: ExtensionEnv): U {
    // console.lg("yyarg", $.toSExprString(expr));
    // case of plain number
    if (is_num_and_gt_zero(expr) || is_pi(expr)) {
        return is_flt(expr) || $.getDirective(Directive.evaluatingAsFloat) ? zeroAsFlt : zero;
    }

    if (is_num_and_negative(expr)) {
        const pi = is_flt(expr) || $.getDirective(Directive.evaluatingAsFloat) ? piAsFlt : MATH_PI;
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
        return $.multiply(DynamicConstants.PI($), half);
    }

    if (is_power(expr)) {
        const base = expr.base;
        // Implementation in which imaginary unit is (pow -1 1/2).
        if (is_num_and_eq_number(base, -1)) {
            // -1 to a power
            return $.multiply(DynamicConstants.PI($), expr.expo);
        }

        // (pow e X) => im(X)
        if (is_base_of_natural_logarithm(base)) {
            // exponential
            // arg(a^(1/2)) is always equal to 1/2 * arg(a)
            // this can obviously be made more generic TODO
            return im(expr.expo, $);
        }
    }

    // (exp X) => im(X)
    if (is_cons(expr) && is_unaop(expr) && is_cons_opr_eq_sym(expr, MATH_EXP)) {
        const arg = im(expr.arg, $);
        return arg;
    }

    if (is_power(expr) && is_num_and_eq_one_half(caddr(expr))) {
        const arg1 = $.arg(cadr(expr));
        return $.multiply(arg1, caddr(expr));
    }

    if (is_multiply(expr)) {
        // product of factors
        return expr
            .tail()
            .map(function (x) {
                return $.arg(x);
            })
            .reduce(function (x, y) {
                return $.add(x, y);
            }, zero);
    }

    if (is_cons(expr) && is_add(expr)) {
        return arg_of_sum_old(expr, $);
    }

    if ($.isreal(expr)) {
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
    const x = re(z, $);
    const y = im(z, $);
    // console.lg(`x => ${$.toListString(x)}`);
    // console.lg(`y => ${$.toListString(y)}`);
    if ($.iszero(x)) {
        if (is_negative(y)) {
            return $.negate(DynamicConstants.PI($));
        } else {
            return DynamicConstants.PI($);
        }
    } else {
        const arg1 = $.arctan($.divide(y, x));
        if (is_negative(x)) {
            if (is_negative(y)) {
                return subtract(arg1, DynamicConstants.PI($), $); // quadrant 1 -> 3
            } else {
                return $.add(arg1, DynamicConstants.PI($)); // quadrant 4 -> 2
            }
        }
        return arg1;
    }
}
