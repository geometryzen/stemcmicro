import { ExprContext } from "@stemcmicro/context";
import { stack_multiply } from "@stemcmicro/eigenmath";
import { StackU } from "@stemcmicro/stack";
// import { multiply_values, prolog_eval_varargs } from "@stemcmicro/helpers";
import { Cons, U } from "@stemcmicro/tree";

export function eval_multiply(expr: Cons, env: ExprContext): U {
    // Using the eigenmath multiplication algorithm seems to put us in an infinite loop.
    const $ = new StackU();
    try {
        stack_multiply(expr, env, $);
        return $.pop();
    } finally {
        $.release();
    }
    //    return prolog_eval_varargs(expr, multiply_values, env);
}
