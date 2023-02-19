
import { divide_numbers } from "./bignum";
import { binop } from "./calculators/binop";
import { ExtensionEnv, MODE_EXPANDING } from "./env/ExtensionEnv";
import { is_num } from "./operators/num/is_num";
import { MATH_MUL } from "./runtime/ns_math";
import { U } from "./tree/tree";

/**
 * Convenience function for dividing lhs by rhs.
 */
export function divide(lhs: U, rhs: U, $: ExtensionEnv): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        return retval;
    };
    if (is_num(lhs) && is_num(rhs)) {
        return hook(divide_numbers(lhs, rhs), "A");
    }
    else {
        const inverse_rhs = $.inverse(rhs);
        return hook(binop(MATH_MUL, lhs, inverse_rhs, $), "B");
    }
}

export function divide_expand(lhs: U, rhs: U, $: ExtensionEnv): U {
    const phase = $.getMode();
    $.setFocus(MODE_EXPANDING);
    try {
        return divide(lhs, rhs, $);
    }
    finally {
        $.setFocus(phase);
    }
}