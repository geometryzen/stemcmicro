import { ExprContext } from "@stemcmicro/context";
import { flatten_items, prolog_eval_varargs, stack_items_to_cons, stack_sort_factors } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { StackU } from "@stemcmicro/stack";
import { Cons, is_cons, U } from "@stemcmicro/tree";
// import { multiply_values } from "./multiply_values";

const MUL = native_sym(Native.multiply);

export function eval_multiply(expr: Cons, env: ExprContext): U {
    return prolog_eval_varargs(expr, multiply_values, env);
}

/**
 *
 */
function multiply_values(values: Cons, env: ExprContext): U {
    const $ = new StackU(); //                      [...]
    const h0 = $.length;
    $.push(MUL); //                                 [..., *]
    const h1 = $.length;
    stack_push_cons(values, $); //                  [..., *, d, (b*c), a]
    flatten_items(h1, MUL, $); //                   [..., *, d, b, c, a]
    stack_sort_factors(h1, env, $); //              [..., *, a, b, c, d]
    // const alpha = stack_combine_numerical_factors(h1, one, $); // [...,]
    stack_items_to_cons($.length - h0, $); //       [...]
    return $.pop();
    // return cons_multiply(...values);
}

function stack_push_cons(xs: Cons, stack: StackU): void {
    if (is_cons(xs)) {
        const head = xs.head;
        const rest = xs.rest;
        try {
            stack.push(head);
            stack_push_cons(rest, stack);
        } finally {
            head.release();
            rest.release();
        }
    }
}
