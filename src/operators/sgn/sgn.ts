import { ExtensionEnv } from '../../env/ExtensionEnv';
import { cadr } from '../../tree/helpers';
import { U } from '../../tree/tree';
import { abs } from '../abs/abs';

export function Eval_sgn(p1: U, $: ExtensionEnv): U {
    return sgn($.valueOf(cadr(p1)), $);
}

/**
 * sgn(x) = x / abs(x) is the generalized defnition.
 * The meaning is that we are discerning the normalized direction.
 * This works for real numbers, complex number.
 */
export function sgn(X: U, $: ExtensionEnv): U {
    // TODO: B ecareful not to go into infinite recursion?
    // Especially if other extensions are not preset?
    return $.divide(X, abs(X, $));

    // return $.multiply($.power(negOne, abs(X, $)), X);

    // This should be taken care of by Rat or Flt extensions.
    /*
    if (is_negative(X)) {
        return $.multiply(items_to_cons(SGN, $.negate(X)), negOne);
    }
    */

    // We're getting the rather interesting result that the function looks like a constructor.
    // return items_to_cons(SGN, X);
}
