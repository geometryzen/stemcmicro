import { ExtensionEnv } from "../env/ExtensionEnv";
import { U } from "../tree/tree";

export interface Pattern {
    match(expr: U, $: ExtensionEnv): boolean;
}