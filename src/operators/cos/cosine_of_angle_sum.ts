import { ExtensionEnv } from "../../env/ExtensionEnv";
import { is_multiple_of_pi } from "../../is_multiple_of_pi";
import { sine } from "../../sin";
import { is_cons, U } from "../../tree/tree";
import { cosine_of_angle } from "./cosine_of_angle";

// Use angle sum formula for special angles.
export function cosine_of_angle_sum(x: U, $: ExtensionEnv): U {
    if (is_cons(x)) {
        for (const B of x.tail()) {
            if (is_multiple_of_pi(B, $)) {
                const A = $.subtract(x, B);
                return $.subtract($.multiply($.cos(A), $.cos(B)), $.multiply(sine(A, $), sine(B, $)));
            }
        }
    }
    return cosine_of_angle(x, $);
}
