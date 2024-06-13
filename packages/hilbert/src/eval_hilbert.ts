import { ExprContext } from "@stemcmicro/context";
import { Cons, U } from "@stemcmicro/tree";
import { hilbert } from "./hilbert";

export function eval_hilbert(expr: Cons, $: ExprContext): U {
    const argList = expr.argList;
    try {
        return hilbert(argList, $);
    } finally {
        argList.release();
    }
}
