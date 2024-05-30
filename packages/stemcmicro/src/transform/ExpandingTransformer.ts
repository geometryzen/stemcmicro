import { U } from "math-expression-tree";
import { Directive, ExtensionEnv } from "../env/ExtensionEnv";
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
