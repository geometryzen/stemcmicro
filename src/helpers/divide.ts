
import { is_num } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { U } from "math-expression-tree";
import { divide_numbers } from "../bignum";
import { Directive } from "../env/ExtensionEnv";
import { inverse } from "./inverse";
import { multiply } from "./multiply";

/**
 * Convenience function for dividing lhs by rhs.
 */
export function divide(lhs: U, rhs: U, $: Pick<ExprContext, 'valueOf'>): U {
    if (is_num(lhs) && is_num(rhs)) {
        return divide_numbers(lhs, rhs);
    }
    else {
        const inverse_rhs = inverse(rhs, $);
        return multiply($, lhs, inverse_rhs);
    }
}

export function divide_expand(lhs: U, rhs: U, $: Pick<ExprContext, 'valueOf' | 'pushDirective' | 'popDirective'>): U {
    $.pushDirective(Directive.expanding, 1);
    try {
        return divide(lhs, rhs, $);
    }
    finally {
        $.popDirective();
    }
}