import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { Cons, is_atom, nil, U } from "math-expression-tree";
import { prolog_eval_1_arg } from "../../dispatch/prolog_eval_1_arg";
import { ExtensionEnv } from "../../env/ExtensionEnv";

const ADJ = native_sym(Native.adj);

export function eval_adj(expr: Cons, env: ExtensionEnv): U {
    return prolog_eval_1_arg(expr, adj, env);
}

export function adj(m: U, env: ExprContext): U {
    if (is_atom(m)) {
        const handler = env.handlerFor(m);
        return handler.dispatch(m, ADJ, nil, env);
    } else {
        throw new Error(`adj argument MUST be an atom.`);
    }
}
