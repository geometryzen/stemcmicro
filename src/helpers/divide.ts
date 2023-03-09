
import { divide_numbers } from "../bignum";
import { ExtensionEnv, MODE_EXPANDING } from "../env/ExtensionEnv";
import { is_num } from "../operators/num/is_num";
import { U } from "../tree/tree";
import { inverse } from "./inverse";

/**
 * Convenience function for dividing lhs by rhs.
 */
export function divide(lhs: U, rhs: U, $: ExtensionEnv): U {
    if (is_num(lhs) && is_num(rhs)) {
        return divide_numbers(lhs, rhs);
    }
    else {
        const inverse_rhs = inverse(rhs, $);
        return $.multiply(lhs, inverse_rhs);
    }
}

export function divide_expand(lhs: U, rhs: U, $: ExtensionEnv): U {
    const phase = $.getMode();
    $.setMode(MODE_EXPANDING);
    try {
        return divide(lhs, rhs, $);
    }
    finally {
        $.setMode(phase);
    }
}