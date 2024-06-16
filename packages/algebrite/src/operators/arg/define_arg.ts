import { half, is_flt, is_imu, is_sym, piAsFlt, zero, zeroAsFlt } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { stack_arg } from "@stemcmicro/eigenmath";
import { add, divide, iszero, is_add, is_base_of_natural_logarithm, is_cons_opr_eq_sym, is_multiply, is_negative, is_num_and_eq_number, is_num_and_eq_one_half, is_num_and_negative, is_pi, is_power, multiply, negate } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { StackU } from "@stemcmicro/stack";
import { caddr, cadr, Cons, is_cons, items_to_cons, U } from "@stemcmicro/tree";
import { subtract } from "../../calculators/sub/subtract";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { isreal } from "../../helpers/isreal";
import { rect } from "../../helpers/rect";
import { is_num_and_gt_zero } from "../../is";
import { DynamicConstants } from "../../runtime/defs";
import { MATH_PI } from "../../runtime/ns_math";
import { arctan } from "../arctan/arctan";
import { denominator } from "../denominator/denominator";
import { MATH_EXP } from "../exp/MATH_EXP";
import { is_unaop } from "../helpers/is_unaop";
import { im } from "../imag/imag";
import { numerator } from "../numerator/numerator";
import { re } from "../real/real";

export const ARG = native_sym(Native.arg);
export const IM = native_sym(Native.imag);
export const RE = native_sym(Native.real);

export function eval_arg(expr: Cons, env: ExtensionEnv): U {
    const $ = new StackU();
    stack_arg(expr, env, $);
    return $.pop();
}

export function arg(z: U, $: ExprContext): U {
    return subtract(yyarg(numerator(z, $), $), yyarg(denominator(z, $), $), $);
}

export function yyarg(expr: U, $: ExprContext): U {
    // console.lg("yyarg", $.toSExprString(expr));
    // case of plain number
    if (is_num_and_gt_zero(expr) || is_pi(expr)) {
        return is_flt(expr) || $.getDirective(Directive.evaluatingAsFloat) ? zeroAsFlt : zero;
    }

    if (is_num_and_negative(expr)) {
        return is_flt(expr) || $.getDirective(Directive.evaluatingAsFloat) ? piAsFlt : MATH_PI;
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
        return multiply($, DynamicConstants.PI($), half);
    }

    if (is_power(expr)) {
        const base = expr.base;
        // Implementation in which imaginary unit is (pow -1 1/2).
        if (is_num_and_eq_number(base, -1)) {
            // -1 to a power
            return multiply($, DynamicConstants.PI($), expr.expo);
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
        const arg1 = arg(cadr(expr), $);
        return multiply($, arg1, caddr(expr));
    }

    if (is_multiply(expr)) {
        // product of factors
        return expr
            .tail()
            .map(function (x) {
                return arg(x, $);
            })
            .reduce(function (x, y) {
                return add($, x, y);
            }, zero);
    }

    if (is_cons(expr) && is_add(expr)) {
        return arg_of_sum_old(expr, $);
    }

    if (isreal(expr, $)) {
        return zero;
    }

    // if we don't assume all passed values are real, all
    // we con do is to leave unexpressed
    return items_to_cons(ARG, expr);
}

function arg_of_sum_old(expr: Cons, $: ExprContext): U {
    // console.lg(`arg_of_sum(${expr})`);
    // sum of terms
    const z = rect(expr, $);
    // console.lg(`z => ${z}`);
    const x = re(z, $);
    const y = im(z, $);
    // console.lg(`x => ${$.toListString(x)}`);
    // console.lg(`y => ${$.toListString(y)}`);
    if (iszero(x, $)) {
        if (is_negative(y)) {
            return negate($, DynamicConstants.PI($));
        } else {
            return DynamicConstants.PI($);
        }
    } else {
        const arg1 = arctan(divide(y, x, $), $);
        if (is_negative(x)) {
            if (is_negative(y)) {
                return subtract(arg1, DynamicConstants.PI($), $); // quadrant 1 -> 3
            } else {
                return add($, arg1, DynamicConstants.PI($)); // quadrant 4 -> 2
            }
        }
        return arg1;
    }
}
