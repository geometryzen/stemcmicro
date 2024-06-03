import { ExprContext, LambdaExpr } from "@stemcmicro/context";
import { Cons } from "@stemcmicro/tree";
import { hilbert_core } from "./hilbert_core";

export const hilbert: LambdaExpr = (argList: Cons, $: ExprContext) => {
    const head = argList.head;
    try {
        const n = $.valueOf(head);
        try {
            return hilbert_core(n, $);
        } finally {
            n.release();
        }
    } finally {
        head.release();
    }
};
