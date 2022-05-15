import { ExtensionEnv } from "../env/ExtensionEnv";
import { nativeInt } from "../nativeInt";
import { U } from "../tree/tree";

export function evaluate_integer(p: U, $: ExtensionEnv): number {
    return nativeInt($.valueOf(p));
}
