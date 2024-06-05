import { imu, is_imu, is_num, is_rat, is_tensor, one, Tensor } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { isone, is_base_of_natural_logarithm, is_pi, multiply, negate, power } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { car, is_atom, is_cons, items_to_cons, nil, U } from "@stemcmicro/tree";
import { complex_conjugate } from "../../complex_conjugate";
import { add } from "../../helpers/add";
import { divide } from "../../helpers/divide";
import { exp } from "../../helpers/exp";
import { imag } from "../../helpers/imag";
import { inner } from "../../helpers/inner";
import { iszero } from "../../helpers/iszero";
import { real } from "../../helpers/real";
import { rect } from "../../helpers/rect";
import { equaln, is_num_and_gt_zero } from "../../is";
import { is_negative } from "../../predicates/is_negative";
import { has_clock_form, has_exp_form } from "../../runtime/find";
import { is_abs, is_add, is_multiply, is_power } from "../../runtime/helpers";
import { oneAsFlt } from "../../tree/flt/Flt";
import { caddr, cadr } from "../../tree/helpers";
import { half, two } from "../../tree/rat/Rat";
import { denominator } from "../denominator/denominator";
import { numerator } from "../numerator/numerator";
import { simplify, simplify_trig } from "../simplify/simplify";

export const ABS = native_sym(Native.abs);

export function abs(x: U, env: ExprContext): U {
    if (is_atom(x)) {
        return env.handlerFor(x).dispatch(x, ABS, nil, env);
    }
    // console.lg("abs", `${x}`);
    const n = numerator(x, env);
    const d = denominator(x, env);
    // console.lg("n => ", `${n}`, "d => ", `${d}`);
    try {
        const abs_numer = absval(n, env);
        const abs_denom = absval(d, env);
        // console.lg("abs(n) => ", `${abs_numer}`, "abs(d) => ", `${abs_denom}`);
        try {
            // The problem here is that if abs_denom is one, then abs_numer is or could be the same as x and we've
            // just set up an infinite loop because the arguments will be re-evaluated.
            return divide(abs_numer, abs_denom, env);
        } finally {
            abs_numer.release();
            abs_denom.release();
        }
    } finally {
        n.release();
        d.release();
    }
}

/**
 * This code exists only for reference purposes. It should be replaced by specialized operators.
 */
export function absval(expr: U, $: ExprContext): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        return retval;
    };

    if (iszero(expr, $)) {
        return hook(expr, "A");
    }

    if (isone(expr, $)) {
        return hook(expr, "B");
    }

    if (is_num(expr) && expr.isNegative()) {
        return hook(negate($, expr), "C");
    }

    if (is_num_and_gt_zero(expr)) {
        return hook(expr, "D");
    }

    if (is_pi(expr)) {
        return hook(expr, "E1");
    }

    // ??? should there be a shortcut case here for the imaginary unit?
    if (is_imu(expr)) {
        return hook(one, "E2");
    }

    // now handle decomposition cases ----------------------------------------------

    // we catch the "add", "power", "multiply" cases first,
    // before falling back to the
    // negative/positive cases because there are some
    // simplification thay we might be able to do.
    // Note that for this routine to give a correct result, this
    // must be a sum where a complex number appears.
    // If we apply this to "a+b", we get an incorrect result.
    // Note that addition of multivectors is handled in a different operator.
    if (is_cons(expr) && is_add(expr)) {
        // If it looks vaguely like a complex number perhaps?
        if (has_clock_form(expr, expr, $) || has_exp_form(expr, $) || expr.contains(imu)) {
            // console.lg(`z? => ${$.toInfixString(expr)}`);

            const z = rect(expr, $); // convert polar terms, if any

            // console.lg(`z => ${$.toInfixString(z)}`);

            const x = real(z, $);
            // console.lg(`x => ${$.toInfixString(x)}`);
            const y = imag(z, $);
            const xx = power($, x, two);
            const yy = power($, y, two);
            const zz = add($, xx, yy);
            const abs_z = power($, zz, half);
            // console.lg(`x => ${$.toInfixString(x)}`)
            // console.lg(`y => ${$.toInfixString(y)}`)
            const retval = simplify_trig(abs_z, $);
            return hook(retval, "F");
        }
    }

    if (is_cons(expr) && is_power(expr) && equaln(car(expr.cdr), -1)) {
        // -1 to any power
        // abs( (-1)^x ) = sqrt( (-1)^x * (-1)^x ) = sqrt( 1^x ) = 1
        return hook($.getDirective(Directive.evaluatingAsFloat) ? oneAsFlt : one, "G");
    }

    // abs(base^expo) is equal to abs(base)^expo IF expo is positive.
    // TODO: This needs more flexibility because (1/a)^(1/m) = a^(-1/m)
    // console.lg("expr", render_as_sexpr(expr, $));
    if (is_cons(expr) && is_power(expr)) {
        // console.lg("abs of an exponential", $.toInfixString(expr));
        const base = cadr(expr);
        const expo = caddr(expr);
        if (is_num(expo)) {
            if (is_num_and_gt_zero(expo)) {
                const abs_base = abs(base, $);
                return hook(power($, abs_base, expo), "H");
            }
            if (is_rat(expo)) {
                // const a = base;
                // const m = expo.numer();
                // const n = expo.denom();
                // Let m = numer(expo), n = denom(expo), with n > 0. m is any integer.
                // abs(a^(m/n)) = abs((a^(1/n))^m) = abs(a^(1/n))^m, for all m (positive, negative, zero)
                // Notice that if m = +1, we get abs(a^(1/n)) = abs(a^(1/n))^1, which leads to infinite recursion.
                // If a is a Num that is non-negative then we can take the n-th root and it will be positive.
                // Under these conditions abs(a^(1/n)) = a^(1/n) and abs(a^(m/n)) = a^(m/n)
                if (is_num(base) && !base.isNegative()) {
                    return hook(power($, base, expo), "I");
                }
            }
        }
    }

    // abs(e^something)
    const base = cadr(expr);
    if (is_power(expr) && is_base_of_natural_logarithm(base)) {
        // exponential
        return hook(exp(real(caddr(expr), $), $), "I");
    }

    if (is_cons(expr) && is_multiply(expr)) {
        // product
        // abs(a * b * c ...) = abs(a) * abs(b) * abs(c) ...
        const binary_multiply = (lhs: U, rhs: U) => multiply($, lhs, rhs);
        return hook(
            expr
                .tail()
                .map((x) => absval(x, $))
                .reduce(binary_multiply),
            "J"
        );
    }

    // abs(abs(x)) => abs(x) (abs is a projection operator).
    if (is_cons(expr) && is_abs(expr)) {
        return hook(expr, "K");
    }

    if (is_tensor(expr)) {
        const retval = abs_tensor(expr, $);
        return hook(retval, "L");
    }

    if (is_negative(expr) || (is_cons(expr) && is_add(expr) && is_negative(cadr(expr)))) {
        const neg_expr = negate($, expr);
        return hook(items_to_cons(ABS, neg_expr), "M");
    }

    // But we haven't handled the sum of terms.
    if (is_cons(expr) && is_add(expr)) {
        // TODO: This should probably be the implementation in all cases.
        // Everything else is just an optimization.
        // By selecting only sums of terms, we are narrowing ourselves down to
        // trying to remove the abs function by applying the Cauchy-Schwartz equality,
        // hoping for the case that all terms are positive.
        // https://en.wikipedia.org/wiki/Cauchy%E2%80%93Schwarz_inequality
        // return hook($.valueOf(simplify($.power($.inner(expr, expr), half), $)), "N");
        return hook(items_to_cons(ABS, expr), "N");
    } else {
        // Here we have given up and simply wrap the expression.
        // Perhaps the real question is whether expr is a vector in an inner product space.
        return hook(items_to_cons(ABS, expr), "O");
    }
}

// also called the "norm" of a vector
export function abs_tensor(M: Tensor, $: ExprContext): U {
    if (M.ndim !== 1) {
        throw new Error("abs(tensor) with tensor rank > 1");
    }
    //
    const K = simplify(M, $);
    // TODO: We need to be careful here. The conjugate operation really belongs inside the inner operation for tensors.
    return $.valueOf(simplify(power($, inner(K, complex_conjugate(K, $), $), half), $));
}
