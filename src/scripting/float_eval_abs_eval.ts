import { ExprContext } from "math-expression-context";
import { U } from "math-expression-tree";
import { abs } from "../helpers/abs";
import { zzfloat } from "../operators/float/float";

export function float_eval_abs_eval(p1: U, $: ExprContext): U {
    return zzfloat($.valueOf(abs($.valueOf(p1), $)), $);
}
