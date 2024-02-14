import { U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";

export function is_scalar(expr: U, $: Pick<ExtensionEnv, 'isscalar'>): expr is U {
    // console.lg("is_scalar", $.toSExprString(expr));
    return $.isscalar(expr);
}
