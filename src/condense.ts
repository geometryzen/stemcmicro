import { ExtensionEnv } from './env/ExtensionEnv';
import { divide } from './helpers/divide';
import { inverse } from './helpers/inverse';
import { multiply_noexpand } from './multiply';
import { gcd } from './operators/gcd/gcd';
import { noexpand_unary } from './runtime/defs';
import { is_add } from './runtime/helpers';
import { doexpand_value_of } from './scripting/doexpand_eval';
import { cadr } from './tree/helpers';
import { zero } from './tree/rat/Rat';
import { U } from './tree/tree';

// Condense an expression by factoring common terms.

export function eval_condense(p1: U, $: ExtensionEnv): U {
    const result = condense($.valueOf(cadr(p1)), $);
    return result;
}

export function condense(p1: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'multiply' | 'power' | 'popDirective' | 'pushDirective' | 'subtract' | 'valueOf'>): U {
    return noexpand_unary(yycondense, p1, $);
}

/**
 * This is a noop if the expression is not an addition.
 * @param P 
 * @param $ 
 * @returns 
 */
export function yycondense(P: U, $: Pick<ExtensionEnv, 'add' | 'factorize' | 'multiply' | 'power' | 'popDirective' | 'pushDirective' | 'subtract' | 'valueOf'>): U {
    // console.lg("yycondense", render_as_sexpr(P, $));
    // console.lg("yycondense", render_as_infix(P, $));

    if (!is_add(P)) {
        return P;
    }

    // get gcd of all terms
    const terms_gcd = P.tail().reduce(function (x, y) {
        return gcd(x, y, $ as ExtensionEnv);
    });

    // console.lg("terms_gcd", render_as_infix(terms_gcd, $));

    // divide each term by gcd, which is to say, multiply each by the inverse.
    const one_divided_by_gcd = inverse(terms_gcd, $);
    const P_divided_by_gcd = P
        .tail()
        .reduce((a: U, b: U) => $.add(a, multiply_noexpand(one_divided_by_gcd, b, $)), zero);

    // We multiplied above w/o expanding so some factors cancelled.

    // Now we expand which normalizes the result and, in some cases,
    // simplifies it too (see test case H).

    // console.lg("P_divided_by_gcd", render_as_infix(P_divided_by_gcd, $));

    const value_of_P_divided_by_gcd = doexpand_value_of(P_divided_by_gcd, $);

    // console.lg("value_of_P_divided_by_gcd", render_as_infix(value_of_P_divided_by_gcd, $));
    // console.lg("one_divided_by_gcd", render_as_infix(one_divided_by_gcd, $));

    // multiply result by gcd, which is to say, divide by 1/gcd.
    const retval = divide(value_of_P_divided_by_gcd, one_divided_by_gcd, $);
    // console.lg(`yycondense(${render_as_infix(P, $)}) => `, render_as_infix(retval, $));
    return retval;
}
