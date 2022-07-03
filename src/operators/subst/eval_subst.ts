import { ExtensionEnv } from "../../env/ExtensionEnv";
import { subst } from "./subst";
import { cadddr, caddr, cadr } from "../../tree/helpers";
import { Cons, U } from "../../tree/tree";

export function Eval_subst(p1: Cons, $: ExtensionEnv): U {
    const newExpr = $.valueOf(cadr(p1));
    const oldExpr = $.valueOf(caddr(p1));
    const expr = $.valueOf(cadddr(p1));
    return $.valueOf(subst(expr, oldExpr, newExpr, $));
}
