import { ExprContext } from "math-expression-context";
import { Cons, U } from "math-expression-tree";
import { dispatch_eval_varargs } from "./dispatch_eval_varargs";

export function dispatch_eval_1_arg(expr: Cons, handler: (x: U, env: ExprContext) => U, env: ExprContext): U {
    return dispatch_eval_varargs(expr, (values, env) => {
        const x = values.item0;
        try {
            return handler(x, env);
        }
        finally {
            x.release();
        }
    }, env);
}
