import { ExtensionEnv } from "../env/ExtensionEnv";
import { use_expanding_with_unary_function } from "../runtime/defs";
import { U } from "../tree/tree";

export function doexpand_eval(p1: U, $: ExtensionEnv): U {
    return use_expanding_with_unary_function(function (x) {
        return $.valueOf(x);
    }, p1, $);
}