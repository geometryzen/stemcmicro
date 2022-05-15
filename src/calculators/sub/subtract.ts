import { ExtensionEnv } from "../../env/ExtensionEnv";
import { MATH_ADD } from "../../runtime/ns_math";
import { U } from "../../tree/tree";
import { binop } from "../binop";

export function subtract(lhs: U, rhs: U, $: ExtensionEnv): U {
    const hook = function (retval: U): U {
        return retval;
    };
    const A = $.negate(rhs);
    const B = binop(MATH_ADD, lhs, A, $);
    return hook(B);
}
