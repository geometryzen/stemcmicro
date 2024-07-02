import { is_rat, one } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { inverse, isone, is_cons_opr_eq_add, is_cons_opr_eq_multiply, is_cons_opr_eq_power, is_negative, multiply_items } from "@stemcmicro/helpers";
import { car, is_cons, U } from "@stemcmicro/tree";
import { rationalize } from "../rationalize/rationalize";

export function denominator(expr: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    if (is_rat(expr)) {
        return expr.denom();
    }

    if (is_cons(expr) && is_cons_opr_eq_add(expr)) {
        expr = rationalize(expr, $);
    }

    if (is_cons(expr)) {
        const argList = expr.cdr;
        // (denom (* x1 x2 x3 ...)) = denom(x1) * denom(x2) * denom(x3)
        // "denominator of products = product of denominators"
        // TODO: Why do I care about whether a1 is one?
        if (is_cons_opr_eq_multiply(expr) && !isone(car(argList), $)) {
            // console.lg("(denom (* x1 x2 x3 ...)) = denom(x1) * denom(x2) * denom(x3)");
            const xs = expr.tail();
            // console.lg(`xs => ${items_to_infix(xs, $)}`);
            const denoms = denominators(xs, $);
            // console.lg(`denominators => ${items_to_infix(denoms, $)}`);
            const product_of_denoms = multiply_items(denoms, $);
            // console.lg(`product_of_denoms => ${$.toInfixString(product_of_denoms)}`)
            return product_of_denoms;
        } else if (is_cons_opr_eq_power(expr) && is_negative(expr.expo)) {
            return inverse(expr, $);
        }
    }

    return one;
}

function denominators(xs: U[], $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U[] {
    const denom_mapper = make_denom_mapper($);
    const denoms = xs.map(denom_mapper);
    return denoms;
}

function make_denom_mapper($: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): (x: U) => U {
    return function (x: U) {
        return denominator(x, $);
    };
}
