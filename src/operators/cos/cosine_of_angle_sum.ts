import { ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { is_multiple_of_pi } from "../../is_multiple_of_pi";
import { Cons, U } from "../../tree/tree";
import { cosine_of_angle } from "./cosine_of_angle";

// Use angle sum formula for special angles.
export function cosine_of_angle_sum(x: Cons, oldExpr: U, $: ExtensionEnv): [TFLAGS, U] {
    for (const B of x.tail()) {
        if (is_multiple_of_pi(B, $)) {
            const A = $.subtract(x, B);
            return [TFLAG_DIFF, $.subtract($.multiply($.cos(A), $.cos(B)), $.multiply($.sin(A), $.sin(B)))];
        }
    }
    return cosine_of_angle(x, oldExpr, $);
}
