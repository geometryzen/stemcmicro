import { U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { doexpand_unary } from "../runtime/defs";

export function doexpand_value_of(expr: U, $: Pick<ExtensionEnv, "valueOf" | "pushDirective" | "popDirective">): U {
    return doexpand_unary(
        function (x: U) {
            const retval = $.valueOf(x);
            return retval;
        },
        expr,
        $
    );
}
