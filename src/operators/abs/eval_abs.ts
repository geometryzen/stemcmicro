import { ExprContext } from "math-expression-context";
import { Cons, U } from "math-expression-tree";
import { prolog_eval_1_arg } from "../../dispatch/prolog_eval_1_arg";
import { abs } from "./abs";

export function eval_abs(expr: Cons, env: ExprContext): U {
    return prolog_eval_1_arg(expr, abs, env);
}
