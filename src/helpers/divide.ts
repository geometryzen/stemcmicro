
import { divide_numbers } from "../bignum";
import { Directive, ExtensionEnv } from "../env/ExtensionEnv";
import { is_num } from "../operators/num/is_num";
import { U } from "../tree/tree";
import { inverse } from "./inverse";

/**
 * Convenience function for dividing lhs by rhs.
 */
export function divide(lhs: U, rhs: U, $: Pick<ExtensionEnv, 'multiply' | 'valueOf'>): U {
    if (is_num(lhs) && is_num(rhs)) {
        return divide_numbers(lhs, rhs);
    }
    else {
        const inverse_rhs = inverse(rhs, $);
        return $.multiply(lhs, inverse_rhs);
    }
}

export function divide_expand(lhs: U, rhs: U, $: Pick<ExtensionEnv, 'multiply' | 'valueOf' | 'pushDirective' | 'popDirective'>): U {
    $.pushDirective(Directive.expanding, true);
    try {
        return divide(lhs, rhs, $);
    }
    finally {
        $.popDirective();
    }
}