import { ExprContext } from "math-expression-context";
import { Cons, U } from "math-expression-tree";
import { dispatch_eval_1_arg } from "../../dispatch/dispatch_eval_1_arg";
import { abs } from "./abs";

export function eval_abs(expr: Cons, env: ExprContext): U {
    return dispatch_eval_1_arg(expr, abs, env);
}
