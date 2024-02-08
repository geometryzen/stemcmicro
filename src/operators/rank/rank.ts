import { create_int, is_tensor, zero } from "math-expression-atoms";
import { Cons } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";

export function Eval_rank(expr: Cons, $: ExtensionEnv) {
    const value = $.valueOf(expr.argList.car);
    return is_tensor(value) ? create_int(value.rank) : zero;
}
