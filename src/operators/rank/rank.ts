import { ExtensionEnv } from "../../env/ExtensionEnv";
import { wrap_as_int, zero } from "../../tree/rat/Rat";
import { Cons } from "../../tree/tree";
import { is_tensor } from "../tensor/is_tensor";

export function Eval_rank(expr: Cons, $: ExtensionEnv) {
    const value = $.valueOf(expr.argList.car);
    return is_tensor(value) ? wrap_as_int(value.rank) : zero;
}
