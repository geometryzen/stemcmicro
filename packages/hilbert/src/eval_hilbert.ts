import { ExprContext } from "@stemcmicro/context";
import { Cons, U } from "@stemcmicro/tree";
import { hilbertLambdaExpr } from "./hilbertLambdaExpr";

export function eval_hilbert(expr: Cons, $: ExprContext): U {
    const argList = expr.argList;
    try {
        return hilbertLambdaExpr(argList, $);
    } finally {
        argList.release();
    }
}
