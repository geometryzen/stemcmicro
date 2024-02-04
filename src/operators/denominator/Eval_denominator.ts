import { Cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { cadr } from "../../tree/helpers";
import { denominator } from "./denominator";

export function Eval_denominator(expr: Cons, $: ExtensionEnv): U {
    return denominator($.valueOf(cadr(expr)), $);
}
