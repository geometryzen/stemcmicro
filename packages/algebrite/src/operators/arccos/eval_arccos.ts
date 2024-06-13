import { ExprContext } from "@stemcmicro/context";
import { Cons, U } from "@stemcmicro/tree";
import { arccos } from "./arccos";

export function eval_arccos(expr: Cons, $: ExprContext): U {
    const x = $.valueOf(expr.argList.head);
    return arccos(x, $);
}
