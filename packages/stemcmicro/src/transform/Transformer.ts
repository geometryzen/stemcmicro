import { ExtensionEnv } from "../env/ExtensionEnv";
import { U } from "../tree/tree";

export interface TreeTransformer {
    transform(tree: U, $: ExtensionEnv): U;
}
