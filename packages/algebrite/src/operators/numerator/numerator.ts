import { is_rat, one } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { isone, is_cons_opr_eq_add, is_cons_opr_eq_multiply, is_cons_opr_eq_power, is_negative, multiply_items } from "@stemcmicro/helpers";
import { car, cdr, Cons, is_cons, U } from "@stemcmicro/tree";
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
    if (is_cons(p1) && is_cons_opr_eq_add(p1)) {
        //console.trace "rationalising "
        p1 = rationalize_factoring(p1, $);
        // console.lg("rationalized", `${p1}`);
    }
    // console.lg(`rationalized=${$.toInfixString(p1)}`);
    // console.lg(`rationalized=${$.toSExprString(p1)}`);

    if (is_cons(p1) && is_cons_opr_eq_multiply(p1) && !isone(car(cdr(p1)), $)) {
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
        return p1.numer();
    }

    if (is_cons(p1) && is_cons_opr_eq_power(p1) && is_negative(p1.expo)) {
        return one;
    }

    return p1;
}
