import { ExprContext, prolog_eval_varargs } from "@stemcmicro/context";
import { Cons, U } from "@stemcmicro/tree";

export function prolog_eval_1_arg(expr: Cons, handler: (x: U, env: ExprContext) => U, env: ExprContext): U {
    return prolog_eval_varargs(
        expr,
        (values, env) => {
            const x = values.item0;
            try {
                return handler(x, env);
            } finally {
                x.release();
            }
        },
        env
    );
}
