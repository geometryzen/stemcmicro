import { ExprContext } from "@stemcmicro/context";
import { StackFunction, StackU } from "@stemcmicro/stack";
import { Cons, U } from "@stemcmicro/tree";

export function make_eval(stackFunction: StackFunction): (expr: Cons, env: ExprContext) => U {
    return function (expr: Cons, env: ExprContext): U {
        const $ = new StackU();
        try {
            stackFunction(expr, env, $);
            return $.pop();
        } finally {
            $.release();
        }
    };
}
