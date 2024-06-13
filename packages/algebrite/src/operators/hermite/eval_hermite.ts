import { cadnr, Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { hermite } from "./hermite";

export function eval_hermite(p1: Cons, $: ExtensionEnv): U {
    const arg1 = $.valueOf(cadnr(p1, 1));
    const arg2 = $.valueOf(cadnr(p1, 2));
    return hermite(arg1, arg2, $);
}
