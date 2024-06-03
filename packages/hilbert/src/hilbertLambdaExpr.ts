import { ExprContext, LambdaExpr } from "@stemcmicro/context";
import { Cons } from "@stemcmicro/tree";
import { hilbert } from "./hilbert";

export const hilbertLambdaExpr: LambdaExpr = (argList: Cons, $: ExprContext) => {
    const head = argList.head;
    try {
        const n = $.valueOf(head);
        try {
            return hilbert(n, $);
        } finally {
            n.release();
        }
    } finally {
        head.release();
    }
};
