import { assert_sym, assert_tensor } from 'math-expression-atoms';
import { Cons, U } from 'math-expression-tree';
import { ExtensionEnv } from '../../env/ExtensionEnv';

/**
 * (let [binding*] expr*)
 */
export function Eval_let(expr: Cons, $: ExtensionEnv): U {
    const bindExpr = assert_tensor(expr.item(1));
    const exprList = expr.item(2);
    try {
        const scope = $.derivedEnv();
        const bindings: U[] = bindExpr.elems;
        // TODO: assert length is even
        const n = bindings.length / 2;
        for (let i = 0; i < n; i++) {
            const sym = assert_sym(bindings[2 * i]);
            const binding = scope.valueOf(bindings[2 * i + 1]);
            scope.setBinding(sym, binding);
        }
        return scope.valueOf(exprList);
    }
    finally {
        bindExpr.release();
        exprList.release();
    }
}
