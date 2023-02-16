import { ExtensionEnv } from "../env/ExtensionEnv";
import { U } from "../tree/tree";

export interface Transformer {
    transform(tree: U, $: ExtensionEnv): U
}