import { U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { Box } from "../runtime/Box";
import { TreeTransformer } from "./Transformer";

export class TransformerPipeline implements TreeTransformer {
    readonly #transformers: TreeTransformer[] = [];
    transform(tree: U, $: ExtensionEnv): U {
        const box = new Box(tree);
        for (let i = 0; i < this.#transformers.length; i++) {
            const t = this.#transformers[i];
            box.push(t.transform(box.pop(), $));
        }
        return box.pop();
    }
    addHead(transformer: TreeTransformer): void {
        this.#transformers.unshift(transformer);
    }
    addTail(transformer: TreeTransformer): void {
        this.#transformers.push(transformer);
    }
}
