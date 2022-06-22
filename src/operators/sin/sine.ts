import { ExtensionEnv } from '../../env/ExtensionEnv';
import { items_to_cons, U } from '../../tree/tree';
import { MATH_SIN } from './MATH_SIN';

export function sin(x: U, $: ExtensionEnv): U {
    return $.valueOf(items_to_cons(MATH_SIN, x));
}
