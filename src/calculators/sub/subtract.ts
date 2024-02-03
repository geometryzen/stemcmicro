import { ExtensionEnv } from "../../env/ExtensionEnv";
import { U } from "../../tree/tree";

export function subtract(lhs: U, rhs: U, $: Pick<ExtensionEnv, 'add' | 'negate'>): U {
    const hook = function (retval: U): U {
        return retval;
    };
    const A = $.negate(rhs);
    const B = $.add(lhs, A);
    return hook(B);
}
