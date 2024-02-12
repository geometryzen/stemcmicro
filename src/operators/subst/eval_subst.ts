import { Cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { subst } from "./subst";

/**
 * subst(newExpr, oldExpr, expr)
 */
export function eval_subst(x: Cons, $: ExtensionEnv): U {
    const args = x.argList;
    const newExpr = $.valueOf(args.item(0));
    const oldExpr = $.valueOf(args.item(1));
    const expr = $.valueOf(args.item(2));
    // Notice the the order of parameters is different.
    return $.valueOf(subst(expr, oldExpr, newExpr, $));
}
