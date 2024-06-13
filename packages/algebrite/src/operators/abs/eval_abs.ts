import { ExprContext } from "@stemcmicro/context";
import { prolog_eval_1_arg } from "@stemcmicro/helpers";
import { Cons, U } from "@stemcmicro/tree";
import { abs } from "./abs";

export function eval_abs(expr: Cons, env: ExprContext): U {
    return prolog_eval_1_arg(expr, abs, env);
}
