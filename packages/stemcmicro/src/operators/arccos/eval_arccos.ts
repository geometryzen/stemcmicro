import { Cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { arccos } from "./arccos";

export function eval_arccos(expr: Cons, $: ExtensionEnv): U {
    const x = $.valueOf(expr.argList.head);
    return arccos(x, $);
}
