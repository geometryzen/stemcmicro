import { Directive } from "@stemcmicro/directive";
import { U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { transform } from "../runtime/execute";
import { TreeTransformer } from "./Transformer";

export class ExpandingTransformer implements TreeTransformer {
    transform(tree: U, $: ExtensionEnv): U {
        $.pushDirective(Directive.expanding, 1);
        try {
            return transform(tree, $);
        } finally {
            $.popDirective();
        }
    }
}
