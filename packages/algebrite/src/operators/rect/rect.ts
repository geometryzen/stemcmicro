import { imu, is_imu, is_sym, zero } from "@stemcmicro/atoms";
import { Directive } from "@stemcmicro/directive";
import { count_factors, is_base_of_natural_logarithm, remove_factors } from "@stemcmicro/helpers";
import { cadnr, Cons, is_cons, items_to_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { COS, RECT } from "../../runtime/constants";
import { has_clock_form, has_exp_form } from "../../runtime/find";
import { is_add, is_multiply, is_power } from "../../runtime/helpers";
import { MATH_SIN } from "../../runtime/ns_math";
import { cadr } from "../../tree/helpers";

/**
 * Convert complex z to rectanglar from.
 */
export function eval_rect(rectExpr: Cons, $: ExtensionEnv): U {
    const arg = cadnr(rectExpr, 1);
    $.pushDirective(Directive.complexAsRectangular, 1);
    try {
        const valueOfArg = $.valueOf(arg);
        const result = rect(valueOfArg, $);
        return result;
    } finally {
        $.popDirective();
    }
}

export function rect(z: U, $: ExtensionEnv): U {
    // console.lg("rect", $.toSExprString(z));
    // console.lg("rect", $.toInfixString(z));
    // if we assume real variables, then the
    // rect of any symbol is the symbol itself
    // (note that 'i' is not a symbol, it's made of (-1)^(1/2))
    // otherwise we have to leave unevalled
    if (is_sym(z)) {
        if ($.isreal(z)) {
            return z;
        }

        return items_to_cons(RECT, z);

        // TODO this is quite dirty, ideally we don't need this
        // but removing this creates a few failings in the tests
        // that I can't investigate right now.
        // --
        // if we assume all variables are real AND
        // it's not an exponential nor a polar nor a clock form
        // THEN rect(_) = _
        // note that these matches can be quite sloppy, one can find expressions
        // which shouldn't match but do
        //
    }

    if (is_power(z)) {
        // console.lg("power");
        const base = z.base;
        if (is_base_of_natural_logarithm(base)) {
            // console.lg("base is E");
            const expo = z.expo;
            // TODO: address case when expo is imu.
            if (is_cons(expo) && count_factors(expo, is_imu) === 1) {
                // console.lg("i in expo");
                const theta = remove_factors(expo, is_imu);
                // console.lg("theta", $.toInfixString(theta));
                const c = $.cos(theta);
                const s = $.sin(theta);
                return $.add(c, $.multiply(imu, s));
            }
        }
    }

    // We are assuming real variables...
    if (!has_exp_form(z, $) && !has_clock_form(z, z, $) && !(z.contains(MATH_SIN) && z.contains(COS) && z.contains(imu))) {
        // console.lg("rect has no polar form", $.toSExprString(z));
        // no polar form?
        return z; // ib
    }

    if (is_cons(z) && is_multiply(z) && is_imu(cadr(z))) {
        // console.lg("rect is sum", $.toSExprString(z));
        return z; // sum
    }

    if (is_cons(z) && is_add(z)) {
        // console.lg("rect is add", $.toSExprString(z));
        return z.tail().reduce((a: U, b: U) => $.add(a, $.rect(b)), zero);
    }

    // TODO: Shouldn't the final statement be the wrapping of the arg in (rect ...)?
    // Then the code below is used in a matcher.

    // try to get to the rectangular form by doing
    // abs(p1) * (cos (theta) + i * sin(theta))
    // where theta is arg(p1)
    // abs(z) * (cos(arg(z)) + i sin(arg(z)))
    // console.lg("rect is computing abs(z)", $.toInfixString(z));
    // const A = arg(z, $);
    // console.lg("theta", $.toInfixString(A));
    const result = $.multiply($.abs(z), $.add($.cos($.arg(z)), $.multiply(imu, $.sin($.arg(z)))));

    return result;
}
