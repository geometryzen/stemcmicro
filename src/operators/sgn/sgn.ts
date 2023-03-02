import { ExtensionEnv } from '../../env/ExtensionEnv';
import { is_complex_number } from '../../is';
import { is_negative } from '../../predicates/is_negative';
import { SGN } from '../../runtime/constants';
import { cadr } from '../../tree/helpers';
import { negOne } from '../../tree/rat/Rat';
import { items_to_cons, U } from '../../tree/tree';
import { abs } from '../abs/abs';

export function Eval_sgn(p1: U, $: ExtensionEnv): U {
    return sgn($.valueOf(cadr(p1)), $);
}

export function sgn(X: U, $: ExtensionEnv): U {
    if (is_complex_number(X)) {
        return $.multiply($.power(negOne, abs(X, $)), X);
    }

    if (is_negative(X)) {
        return $.multiply(items_to_cons(SGN, $.negate(X)), negOne);
    }

    return items_to_cons(SGN, X);
}
