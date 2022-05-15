import { ExtensionEnv } from "../env/ExtensionEnv";
import { doexpand1 } from "../runtime/defs";
import { U } from "../tree/tree";

export function doexpand_eval(p1: U, $: ExtensionEnv): U {
    return doexpand1(function (x) {
        return $.valueOf(x);
    }, p1, $);
}