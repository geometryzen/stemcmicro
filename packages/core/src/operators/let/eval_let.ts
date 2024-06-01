import { assert_sym, assert_tensor } from "@stemcmicro/atoms";
import { Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";

/**
 * (let [binding*] expr)
 */
export function eval_let(expr: Cons, $: ExtensionEnv): U {
    const bindExpr = assert_tensor(expr.item(1));
    const body = expr.item(2);
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
        return scope.valueOf(body);
    } finally {
        bindExpr.release();
        body.release();
    }
}
