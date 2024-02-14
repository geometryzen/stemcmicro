import { U } from "math-expression-tree";
import { Extension, ExtensionEnv } from "../env/ExtensionEnv";

/**
 * Locates the handler for the expression and calls toListString on it.
 * This is a convenience function to avoid having to deal with correctly reference counting the handlers.
 * @param expr The expression to be serialized.
 */
export function to_list_string(expr: U, $: ExtensionEnv): string {
    const op: Extension<U> | undefined = $.extensionFor(expr);
    if (op) {
        const retval = op.toListString(expr, $);
        return retval;
    }
    else {
        return `${expr}`;
    }
}
