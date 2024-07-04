import { ExprContext } from "@stemcmicro/context";
import { multiply_values, prolog_eval_varargs } from "@stemcmicro/helpers";
import { Cons, U } from "@stemcmicro/tree";

export function eval_multiply(expr: Cons, env: ExprContext): U {
    return prolog_eval_varargs(expr, multiply_values, env);
}
