import { one } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { U } from "@stemcmicro/tree";
import { binop } from "./calculators/binop";
import { ExtensionEnv } from "./env/ExtensionEnv";
import { multiply } from "./helpers/multiply";
import { negate } from "./helpers/negate";
import { noexpand_binary, noexpand_unary } from "./runtime/defs";
import { MATH_MUL } from "./runtime/ns_math";

export function multiply_binary(lhs: U, rhs: U, _: Pick<ExtensionEnv, "valueOf">): U {
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

/**
 * TODO: Why doesn't this function perform sorting of the factors?
 * multiply n factors
 * [a b c d ...] => (multiply (multiply a b) c)
 * @param items is an integer
 */
export function multiply_items(items: U[], _: Pick<ExprContext, "valueOf">): U {
    // console.lg(`multiply_items items => ${items_to_infix(items, $)} ${items_to_sexpr(items, $)}`);
    if (items.length > 1) {
        let temp = items[0];
        for (let i = 1; i < items.length; i++) {
            temp = multiply(_, temp, items[i]);
        }
        return temp;
    } else {
        if (items.length === 1) {
            return items[0];
        }
        return one;
    }
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
