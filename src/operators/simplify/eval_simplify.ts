import { Cons, U } from 'math-expression-tree';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { simplify } from './simplify';

export function eval_simplify(expr: Cons, $: ExtensionEnv): U {
    return simplify($.valueOf(expr.arg), $);
}
