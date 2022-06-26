import { ExtensionEnv } from "../../env/ExtensionEnv";
import { cadr } from "../../tree/helpers";
import { wrap_as_int, zero } from "../../tree/rat/Rat";
import { U } from "../../tree/tree";
import { is_tensor } from "../tensor/is_tensor";

// rank definition
export function Eval_rank(p1: U, $: ExtensionEnv) {
    p1 = $.valueOf(cadr(p1));
    return is_tensor(p1) ? wrap_as_int(p1.rank) : zero;
}
