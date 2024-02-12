import { create_tensor } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { coefficients } from "./coeff";

/**
 * (coefficients p x)
 */
export function eval_coefficients(expr: Cons, $: ExtensionEnv): U {
    const p = $.valueOf(expr.item1);
    const x = $.valueOf(expr.item2);
    const cs: U[] = coefficients(p, x, $);
    return create_tensor(cs);
}