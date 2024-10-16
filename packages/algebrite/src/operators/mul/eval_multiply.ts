import { ExprContext } from "@stemcmicro/context";
// import { Directive } from "@stemcmicro/directive";
// import { stack_multiply } from "@stemcmicro/eigenmath";
import { multiply_values, prolog_eval_varargs } from "@stemcmicro/helpers";
// import { StackU } from "@stemcmicro/stack";
// import { multiply_values, prolog_eval_varargs } from "@stemcmicro/helpers";
import { Cons, U } from "@stemcmicro/tree";

export function eval_multiply(expr: Cons, env: ExprContext): U {
    // const debug = env.getDirective(Directive.traceLevel) > 0;
    // Using the eigenmath multiplication algorithm seems to put us in an infinite loop.
    /*
    const $ = new StackU();
    try {
        stack_multiply(expr, env, $);
        const retval = $.pop();
        if (debug) {
            // console.lg("eval_multiply", `${expr}`, `${retval}`);
        }
        return retval;
    } finally {
        $.release();
    }
    */
    return prolog_eval_varargs(expr, multiply_values, env);
}
