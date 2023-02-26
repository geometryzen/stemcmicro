import { ExtensionEnv } from "../env/ExtensionEnv";
import { doexpand_unary } from "../runtime/defs";
import { U } from "../tree/tree";

export function doexpand_value_of(expr: U, $: ExtensionEnv): U {
    return doexpand_unary(function (x: U) {
        return $.valueOf(x);
    }, expr, $);
}