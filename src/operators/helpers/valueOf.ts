import { ExtensionEnv } from "../../env/ExtensionEnv";
import { U } from "../../tree/tree";

/**
 * Execute the transform, ignoring whether the expression actually changed.
 * @param expr T expression to be transformed.
 */
export function value_of(expr: U, $: ExtensionEnv): U {
    return $.transform(expr)[1];
}