import { Tensor } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { cadr } from "../../tree/helpers";
import { det } from "./det";

export function eval_det(expr: Cons, $: ExtensionEnv): U {
    const arg = $.valueOf(cadr(expr)) as Tensor;
    return det(arg, $);
}
