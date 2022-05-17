import { binop } from './calculators/binop';
import { ExtensionEnv, PHASE_FACTORING } from './env/ExtensionEnv';
import { use_factoring_with_unary_function, use_factoring_with_binary_function } from './runtime/defs';
import { MATH_MUL } from './runtime/ns_math';
import { one } from './tree/rat/Rat';
import { U } from './tree/tree';

export function multiply(lhs: U, rhs: U, $: ExtensionEnv): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        return retval;
    };
    return hook(binop(MATH_MUL, lhs, rhs, $), "A");
}

// this is useful for example when you are just adding/removing
// factors from an already factored quantity.
// e.g. if you factored x^2 + 3x + 2 into (x+1)(x+2)
// and you want to divide by (x+1) , i.e. you multiply by (x-1)^-1,
// then there is no need to expand.
export function multiply_noexpand(arg1: U, arg2: U, $: ExtensionEnv): U {
    return use_factoring_with_binary_function(multiply, arg1, arg2, $);
}

/**
 * TODO: Why doesn't this function perform sorting of the factors?
 * multiply n factors
 * [a b c d ...] => (multiply (multiply a b) c)
 * @param items is an integer
 */
export function multiply_items(items: U[], $: ExtensionEnv): U {
    // console.lg(`multiply_items items => ${items_to_infix(items, $)} ${items_to_sexpr(items, $)}`);
    if (items.length > 1) {
        let temp = items[0];
        for (let i = 1; i < items.length; i++) {
            temp = $.multiply(temp, items[i]);
        }
        return temp;
    }
    else {
        if (items.length === 1) {
            return items[0];
        }
        return one;
    }
}

// n an integer
export function multiply_items_factoring(items: U[], $: ExtensionEnv): U {
    const phase = $.getPhase();
    $.setPhase(PHASE_FACTORING);
    try {
        return multiply_items(items, $);
    }
    finally {
        $.setPhase(phase);
    }
}


export function negate_noexpand(p1: U, $: ExtensionEnv): U {
    const negate = function (x: U, $: ExtensionEnv): U {
        return $.negate(x);
    };
    return use_factoring_with_unary_function(negate, p1, $);
}

//-----------------------------------------------------------------------------
//
//  > a*hilbert(2)
//  ((a,1/2*a),(1/2*a,1/3*a))
//
//  Note that "a" is presumed to be a scalar. Is this correct?
//
//  Yes, because "*" has no meaning if "a" is a tensor.
//  To multiply tensors, "dot" or "outer" should be used.
//
//  > dot(a,hilbert(2))
//  dot(a,((1,1/2),(1/2,1/3)))
//
//  In this case "a" could be a scalar or tensor so the result is not
//  expanded.
//
//-----------------------------------------------------------------------------
