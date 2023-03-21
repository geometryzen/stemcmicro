import { mp_denominator } from '../../bignum';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { inverse } from '../../helpers/inverse';
import { multiply_items } from '../../multiply';
import { is_negative } from '../../predicates/is_negative';
import { is_add, is_multiply, is_power } from '../../runtime/helpers';
import { caddr, cadr } from '../../tree/helpers';
import { one } from '../../tree/rat/Rat';
import { car, Cons, is_cons, U } from '../../tree/tree';
import { is_rat } from '../rat/is_rat';
import { rationalize_factoring } from '../rationalize/rationalize';

/* denominator =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the denominator of expression x.

*/
export function Eval_denominator(expr: Cons, $: ExtensionEnv): U {
    return denominator($.valueOf(cadr(expr)), $);
}

export function denominator(expr: U, $: ExtensionEnv): U {
    // console.lg(`ENTERING denominator of ${$.toInfixString(expr)} ${$.toListString(expr)}`);
    const hook = function (retval: U): U {
        // console.lg(`LEAVING denominator of ${$.toInfixString(expr)} ${$.toListString(expr)} => ${$.toInfixString(retval)}`);
        return retval;
    };
    //console.trace "denominator of: " + p1
    if (is_add(expr)) {
        expr = rationalize_factoring(expr, $);
    }

    // (denom (* x1 x2 x3 ...)) = denom(x1) * denom(x2) * denom(x3)
    // "denominator of products = product of denominators"
    if (is_cons(expr)) {
        const argList = expr.cdr;
        // TODO: Why do I care about whether a1 is one?
        if (is_multiply(expr) && !$.isone(car(argList))) {
            // console.lg("(denom (* x1 x2 x3 ...)) = denom(x1) * denom(x2) * denom(x3)");
            const xs = expr.tail();
            // console.lg(`xs => ${items_to_infix(xs, $)}`);
            const denoms = denominators(xs, $);
            // console.lg(`denominators => ${items_to_infix(denoms, $)}`);
            const product_of_denoms = multiply_items(denoms, $);
            // console.lg(`product_of_denoms => ${$.toInfixString(product_of_denoms)}`)
            return hook(product_of_denoms);
        }
    }

    if (is_rat(expr)) {
        return hook(mp_denominator(expr));
    }

    if (is_power(expr) && is_negative(caddr(expr))) {
        return hook(inverse(expr, $));
    }

    return hook(one);
}

function denominators(xs: U[], $: ExtensionEnv): U[] {
    const denom_mapper = make_denom_mapper($);
    const denoms = xs.map(denom_mapper);
    return denoms;
}

function make_denom_mapper($: ExtensionEnv): (x: U) => U {
    return function (x: U) {
        return denominator(x, $);
    };
}
