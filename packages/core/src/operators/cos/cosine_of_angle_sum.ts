import { Directive } from "@stemcmicro/directive";
import { ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { is_multiple_of_pi } from "../../is_multiple_of_pi";
import { Cons, U } from "../../tree/tree";
import { cosine_of_angle } from "./cosine_of_angle";

// Use angle sum formula for special angles.
export function cosine_of_angle_sum(addExpr: Cons, oldExpr: U, $: ExtensionEnv): [TFLAGS, U] {
    if ($.getDirective(Directive.expandCosSum)) {
        const a = addExpr.argList.head;
        const b = $.add(...addExpr.argList.tail());
        return [TFLAG_DIFF, $.subtract($.multiply($.cos(a), $.cos(b)), $.multiply($.sin(a), $.sin(b)))];
    } else {
        for (const B of addExpr.tail()) {
            if (is_multiple_of_pi(B, $)) {
                const A = $.subtract(addExpr, B);
                return [TFLAG_DIFF, $.subtract($.multiply($.cos(A), $.cos(B)), $.multiply($.sin(A), $.sin(B)))];
            }
        }
        return cosine_of_angle(addExpr, oldExpr, $);
    }
}
