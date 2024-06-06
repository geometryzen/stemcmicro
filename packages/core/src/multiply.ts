import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { multiply_items, negate } from "@stemcmicro/helpers";
import { U } from "@stemcmicro/tree";
import { binop } from "./calculators/binop";
import { noexpand_binary, noexpand_unary } from "./runtime/defs";
import { MATH_MUL } from "./runtime/ns_math";

export function multiply_binary(lhs: U, rhs: U, _: Pick<ExprContext, "valueOf">): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        return retval;
    };
    return hook(binop(MATH_MUL, lhs, rhs, _), "A");
}

// this is useful for example when you are just adding/removing
// factors from an already factored quantity.
// e.g. if you factored x^2 + 3x + 2 into (x+1)(x+2)
// and you want to divide by (x+1) , i.e. you multiply by (x-1)^-1,
// then there is no need to expand.
export function multiply_noexpand(arg1: U, arg2: U, _: Pick<ExprContext, "valueOf" | "pushDirective" | "popDirective">): U {
    return noexpand_binary(multiply_binary, arg1, arg2, _);
}

// n an integer
export function multiply_items_factoring(items: U[], _: ExprContext): U {
    _.pushDirective(Directive.factoring, 1);
    try {
        return multiply_items(items, _);
    } finally {
        _.popDirective();
    }
}

export function negate_noexpand(p1: U, _: ExprContext): U {
    function neg(expr: U, $: ExprContext) {
        return negate($, expr);
    }
    return noexpand_unary(neg, p1, _);
}
