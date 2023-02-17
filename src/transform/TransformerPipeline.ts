import { ExtensionEnv } from "../env/ExtensionEnv";
import { Box } from "../runtime/Box";
import { U } from "../tree/tree";
import { TreeTransformer } from "./Transformer";

export class TransformerPipeline implements TreeTransformer {
    readonly ts: TreeTransformer[] = [];
    transform(tree: U, $: ExtensionEnv): U {
        const box = new Box(tree);
        for (let i = 0; i < this.ts.length; i++) {
            const t = this.ts[i];
            box.push(t.transform(box.pop(), $));
        }
        return box.pop();
    }

}