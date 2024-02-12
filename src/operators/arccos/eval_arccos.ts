import { ExtensionEnv } from '../../env/ExtensionEnv';
import { Cons, U } from '../../tree/tree';
import { arccos } from './arccos';

export function eval_arccos(expr: Cons, $: ExtensionEnv): U {
    const x = $.valueOf(expr.argList.head);
    return arccos(x, $);
}
