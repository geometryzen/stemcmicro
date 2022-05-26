import { ExtensionEnv } from "../../env/ExtensionEnv";
import { sine } from "./sin";
import { cadr } from "../../tree/helpers";
import { U } from "../../tree/tree";

// Sine function of numerical and symbolic arguments
export function Eval_sin(p1: U, $: ExtensionEnv): U {
    const result = sine($.valueOf(cadr(p1)), $);
    return result;
}
