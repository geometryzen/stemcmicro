import { ExtensionEnv } from "../env/ExtensionEnv";
import { U } from "../tree/tree";

/**
 * Locates the handler for the expression and calls toListString on it.
 * This is a convenience function to avoid having to deal with correctly reference counting the handlers.
 * @param expr The expression to be serialized.
 */
export function to_list_string(expr: U, $: ExtensionEnv): string {
    const op = $.operatorFor(expr);
    const retval = op.toListString(expr);
    return retval;
}
