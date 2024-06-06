import { is_rat, one } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { isone, is_add, is_multiply, is_negative, is_power } from "@stemcmicro/helpers";
import { caddr, car, cdr, Cons, U } from "@stemcmicro/tree";
import { mp_numerator } from "../../bignum";
import { multiply_items } from "../../multiply";
import { rationalize_factoring } from "../rationalize/rationalize";

export function eval_numerator(expr: Cons, $: ExprContext): U {
    const argList = expr.argList;
    try {
        const head = argList.head;
        try {
            // console.lg("eval_numerator", "head", `${$.toInfixString(head)}`);
            const arg = $.valueOf(head);
            try {
                // console.lg("eval_numerator", "arg", `${$.toInfixString(arg)}`);
                return numerator(arg, $);
            } finally {
                arg.release();
            }
        } finally {
            head.release();
        }
    } finally {
        argList.release();
    }
}

export function numerator(p1: U, $: Pick<ExprContext, "handlerFor" | "pushDirective" | "popDirective" | "valueOf">): U {
    // console.lg("numerator", `${p1}`);
    if (is_add(p1)) {
        //console.trace "rationalising "
        p1 = rationalize_factoring(p1, $);
        // console.lg("rationalized", `${p1}`);
    }
    // console.lg(`rationalized=${$.toInfixString(p1)}`);
    // console.lg(`rationalized=${$.toSExprString(p1)}`);

    if (is_multiply(p1) && !isone(car(cdr(p1)), $)) {
        // console.lg "p1 inside multiply: " + p1
        // console.lg "first term: " + car(p1)
        return multiply_items(
            p1.tail().map(function (x) {
                return numerator(x, $);
            }),
            $
        );
    }

    if (is_rat(p1)) {
        return mp_numerator(p1);
    }

    if (is_power(p1) && is_negative(caddr(p1))) {
        return one;
    }

    return p1;
}
