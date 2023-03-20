import { ExtensionEnv } from "../env/ExtensionEnv";
import { nativeInt } from "../nativeInt";
import { U } from "../tree/tree";

/**
 * Evaluates the expression then converts it ot a JavaScript number.
 */
export function evaluate_integer(expr: U, $: ExtensionEnv): number {
    return nativeInt($.valueOf(expr));
}
