import { ExprContext } from "math-expression-context";
import { U } from "math-expression-tree";
import { abs } from "../helpers/abs";
import { evaluate_as_float } from "../operators/float/float";

export function float_eval_abs_eval(p1: U, $: ExprContext): U {
    return evaluate_as_float($.valueOf(abs($.valueOf(p1), $)), $);
}
