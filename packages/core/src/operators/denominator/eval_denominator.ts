import { Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { cadr } from "../../tree/helpers";
import { denominator } from "./denominator";

export function eval_denominator(expr: Cons, $: ExtensionEnv): U {
    return denominator($.valueOf(cadr(expr)), $);
}
