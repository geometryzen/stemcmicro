import { ExtensionEnv } from "../env/ExtensionEnv";
import { render_as_infix } from "../print/render_as_infix";
import { Cons } from "../tree/tree";

/**
 * A helper function for printing a Cons expression.
 */
export function cons_to_infix_string(expr: Cons, $: ExtensionEnv): string {
    return render_as_infix(expr, $);
}
