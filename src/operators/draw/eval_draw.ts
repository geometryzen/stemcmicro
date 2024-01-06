import { Cons, nil, U } from 'math-expression-tree';
import { ExtensionEnv } from '../../env/ExtensionEnv';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Eval_draw(expr: Cons, $: ExtensionEnv): U {
    const F = $.valueOf(expr.item(1));
    const X = $.valueOf(expr.item(2));
    // eslint-disable-next-line no-console
    console.log(`draw(${$.toInfixString(F)},${$.toInfixString(X)})`);
    return nil;
}
