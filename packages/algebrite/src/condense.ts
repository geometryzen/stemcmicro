import { zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { add, divide, inverse, is_cons_opr_eq_add } from "@stemcmicro/helpers";
import { Cons, is_cons, U } from "@stemcmicro/tree";
import { multiply_noexpand } from "./multiply";
import { gcd } from "./operators/gcd/gcd";
import { noexpand_unary } from "./runtime/defs";
import { doexpand_value_of } from "./scripting/doexpand_eval";

/**
 * Condense an expression by factoring and cancelling common terms.
 */
export function eval_condense(expr: Cons, $: ExprContext): U {
    const argList = expr.argList;
    try {
        const arg = argList.head;
        try {
            const x = $.valueOf(arg);
            try {
                return condense(x, $);
            } finally {
                x.release();
            }
        } finally {
            arg.release();
        }
    } finally {
        argList.release();
    }
}

/**
 * Condense an expression by factoring and cancelling common terms.
 */
export function condense(x: U, $: Pick<ExprContext, "getDirective" | "handlerFor" | "popDirective" | "pushDirective" | "valueOf">): U {
    return noexpand_unary(yycondense, x, $);
}

function yycondense(x: U, $: Pick<ExprContext, "getDirective" | "handlerFor" | "popDirective" | "pushDirective" | "valueOf">): U {
    const debug = $.getDirective(Directive.traceLevel) > 0;
    if (is_cons(x) && is_cons_opr_eq_add(x)) {
        const terms = x.tail();
        // get gcd of all terms
        const terms_gcd = terms.reduce(function (previous, current) {
            return gcd(previous, current, $);
        });

        // divide each term by gcd, which is to say, multiply each by the inverse.
        const one_divided_by_gcd = inverse(terms_gcd, $);

        const P_divided_by_gcd = terms.reduce((a: U, b: U) => add($, a, multiply_noexpand(one_divided_by_gcd, b, $)), zero);

        // We multiplied above w/o expanding so some factors cancelled.

        // Now we expand which normalizes the result and, in some cases,
        // simplifies it too (see test case H).

        // console.lg("P_divided_by_gcd", render_as_infix(P_divided_by_gcd, $));

        const value_of_P_divided_by_gcd = doexpand_value_of(P_divided_by_gcd, $);
        if (debug) {
            // console.lg("P_divided_by_gcd", `${P_divided_by_gcd}`);
        }

        // multiply result by gcd, which is to say, divide by 1/gcd.
        const retval = divide(value_of_P_divided_by_gcd, one_divided_by_gcd, $);
        if (debug) {
            // console.lg("condense", "retval", `${x}`, " => ", `${retval}`);
        }
        return retval;
    } else {
        return x;
    }
}
