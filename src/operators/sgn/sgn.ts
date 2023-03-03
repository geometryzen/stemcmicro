import { divide } from '../../helpers/divide';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { cadr } from '../../tree/helpers';
import { U } from '../../tree/tree';
import { abs } from '../abs/abs';

export function Eval_sgn(expr: U, $: ExtensionEnv): U {
    return sgn($.valueOf(cadr(expr)), $);
}

/**
 * sgn(x) = x / abs(x) is the generalized defnition.
 * The meaning is that we are discerning the normalized direction.
 */
export function sgn(X: U, $: ExtensionEnv): U {
    return divide(X, abs(X, $), $);
}
