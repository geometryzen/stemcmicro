import { cadnr } from '../../calculators/cadnr';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { halt } from '../../runtime/defs';
import { evaluate_integer } from '../../scripting/evaluate_integer';
import { create_int, zero } from '../../tree/rat/Rat';
import { Cons, U } from '../../tree/tree';
import { is_sym } from '../sym/is_sym';

/**
 * sum(body,index,lower,upper)
 */
export function Eval_sum(expr: Cons, $: ExtensionEnv): U {
    const body = cadnr(expr, 1);
    const index = cadnr(expr, 2);
    const lower = cadnr(expr, 3);
    const upper = cadnr(expr, 4);
    const result = sum(body, index, lower, upper, expr, $);
    return result;
}

function sum(body: U, index: U, lower: U, upper: U, expr: Cons, $: ExtensionEnv): U {
    if (!is_sym(index)) {
        halt('sum: 2nd arg?');
    }

    const lowerBound = evaluate_integer(lower, $);
    if (isNaN(lowerBound)) {
        return expr;
    }

    const upperBound = evaluate_integer(upper, $);
    if (isNaN(upperBound)) {
        return expr;
    }

    // remember contents of the index
    // variable so we can restore it back after the loop
    const original = $.getBinding(index);
    try {
        let temp: U = zero;
        for (let i = lowerBound; i <= upperBound; i++) {
            $.setBinding(index, create_int(i));
            temp = $.add(temp, $.valueOf(body));
        }
        return temp;
    }
    finally {
        $.setBinding(index, original);
    }
}
