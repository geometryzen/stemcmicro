import { zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { add, inverse, is_add } from "@stemcmicro/helpers";
import { cadr, U } from "@stemcmicro/tree";
import { divide } from "./helpers/divide";
import { multiply_noexpand } from "./multiply";
import { gcd } from "./operators/gcd/gcd";
import { noexpand_unary } from "./runtime/defs";
import { doexpand_value_of } from "./scripting/doexpand_eval";

/**
 * Condense an expression by factoring common terms.
 */
export function eval_condense(expr: U, $: ExprContext): U {
    const result = condense($.valueOf(cadr(expr)), $);
    return result;
}

export function condense(x: U, $: Pick<ExprContext, "handlerFor" | "popDirective" | "pushDirective" | "valueOf">): U {
    // console.lg("condense", `${x}`);
    return noexpand_unary(yycondense, x, $);
}

/**
 * This is a noop if the expression is not an addition.
 * @param P
 * @param $
 * @returns
 */
export function yycondense(P: U, $: Pick<ExprContext, "handlerFor" | "popDirective" | "pushDirective" | "valueOf">): U {
    // console.lg("yycondense", `${P}`);

    if (!is_add(P)) {
        return P;
    }

    // get gcd of all terms
    const terms_gcd = P.tail().reduce(function (previous, current) {
        return gcd(previous, current, $);
    });

    // console.lg("terms_gcd", `${terms_gcd}`);

    // divide each term by gcd, which is to say, multiply each by the inverse.
    const one_divided_by_gcd = inverse(terms_gcd, $);

    // console.lg("one_divided_by_gcd", `${one_divided_by_gcd}`);

    const P_divided_by_gcd = P.tail().reduce((a: U, b: U) => add($, a, multiply_noexpand(one_divided_by_gcd, b, $)), zero);

    // We multiplied above w/o expanding so some factors cancelled.

    // Now we expand which normalizes the result and, in some cases,
    // simplifies it too (see test case H).

    // console.lg("P_divided_by_gcd", render_as_infix(P_divided_by_gcd, $));

    const value_of_P_divided_by_gcd = doexpand_value_of(P_divided_by_gcd, $);

    // console.lg("value_of_P_divided_by_gcd", render_as_infix(value_of_P_divided_by_gcd, $));
    // console.lg("one_divided_by_gcd", render_as_infix(one_divided_by_gcd, $));

    // multiply result by gcd, which is to say, divide by 1/gcd.
    const retval = divide(value_of_P_divided_by_gcd, one_divided_by_gcd, $);
    // console.lg(`yycondense(${render_as_infix(P, $)}) => `, render_as_infix(retval, $));
    return retval;
}
