import { is_rat, one } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { is_add, is_multiply, is_negative, is_power } from "@stemcmicro/predicates";
import { car, is_cons, U } from "@stemcmicro/tree";
import { inverse } from "../../helpers/inverse";
import { isone } from "../../helpers/isone";
import { multiply_items } from "../../multiply";
import { rationalize_factoring } from "../rationalize/rationalize";

export function denominator(expr: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    // console.lg("denominator", `${expr}`);
    const hook = function (retval: U): U {
        // console.lg(`LEAVING denominator of ${$.toInfixString(expr)} ${$.toListString(expr)} => ${$.toInfixString(retval)}`);
        return retval;
    };

    if (is_rat(expr)) {
        return hook(expr.denom());
    }

    if (is_cons(expr) && is_add(expr)) {
        expr = rationalize_factoring(expr, $);
    }

    if (is_cons(expr)) {
        const argList = expr.cdr;
        // (denom (* x1 x2 x3 ...)) = denom(x1) * denom(x2) * denom(x3)
        // "denominator of products = product of denominators"
        // TODO: Why do I care about whether a1 is one?
        if (is_multiply(expr) && !isone(car(argList), $)) {
            // console.lg("(denom (* x1 x2 x3 ...)) = denom(x1) * denom(x2) * denom(x3)");
            const xs = expr.tail();
            // console.lg(`xs => ${items_to_infix(xs, $)}`);
            const denoms = denominators(xs, $);
            // console.lg(`denominators => ${items_to_infix(denoms, $)}`);
            const product_of_denoms = multiply_items(denoms, $);
            // console.lg(`product_of_denoms => ${$.toInfixString(product_of_denoms)}`)
            return hook(product_of_denoms);
        } else if (is_power(expr) && is_negative(expr.expo)) {
            return hook(inverse(expr, $));
        }
    }

    return hook(one);
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
