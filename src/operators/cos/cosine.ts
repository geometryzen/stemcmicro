import { ExtensionEnv } from '../../env/ExtensionEnv';
import { items_to_cons, U } from '../../tree/tree';
import { MATH_COS } from './MATH_COS';

/**
 * Wraps the argument in a cosine function and 
 */
export function cos(x: U, $: ExtensionEnv): U {
    return $.valueOf(items_to_cons(MATH_COS, x));
}
