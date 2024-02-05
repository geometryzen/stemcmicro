import { is_num } from 'math-expression-atoms';
import { Cons, items_to_cons, U } from 'math-expression-tree';
import { Directive, ExtensionEnv } from '../env/ExtensionEnv';
import { power_v1 } from '../operators/pow/power_v1';
import { MATH_POW } from '../runtime/ns_math';

function value_of_base(baseArg: U, expo: U, $: ExtensionEnv): U {
    if (is_num(expo) && expo.isNegative()) {
        $.pushDirective(Directive.expanding, true);
        try {
            return $.valueOf(baseArg);
        }
        finally {
            $.popDirective();
        }
    }
    else {
        return $.valueOf(baseArg);
    }
}

/**
 * 
 */
export function Eval_power(expr: Cons, $: ExtensionEnv): U {
    // console.lg("Eval_power", `${expr}`);
    // Ideally, we'd decrement.
    $.pushDirective(Directive.expanding, false);
    try {
        const baseArg = expr.base;
        const expoArg = expr.expo;
        // Eigenmath evaluates the base according to whether the exponent is a negative number?
        const expo = $.valueOf(expoArg);
        const base = value_of_base(baseArg, expo, $);
        if (base.equals(baseArg) && expo.equals(expoArg)) {
            return power_v1(base, expo, $);
        }
        else {
            return $.valueOf(items_to_cons(MATH_POW, base, expo));
        }
    }
    finally {
        $.popDirective();
    }
}
