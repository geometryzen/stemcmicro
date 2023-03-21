import { ExtensionEnv } from "../../env/ExtensionEnv";
import { cadddr, caddr, cadr } from "../../tree/helpers";
import { Cons, U } from "../../tree/tree";
import { subst } from "./subst";

export function Eval_subst(substExpr: Cons, $: ExtensionEnv): U {
    const newExpr = $.valueOf(cadr(substExpr));
    const oldExpr = $.valueOf(caddr(substExpr));
    const expr = $.valueOf(cadddr(substExpr));
    // Notice the the order of parameters is different.
    return $.valueOf(subst(expr, oldExpr, newExpr, $));
}
