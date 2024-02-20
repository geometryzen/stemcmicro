import { Native, native_sym } from 'math-expression-native';
import { Cons, is_atom, nil, U } from 'math-expression-tree';
import { ExtensionEnv } from '../../env/ExtensionEnv';

const ADJ = native_sym(Native.adj);

export function eval_adj(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        const arg = argList.head;
        try {
            const m = $.valueOf(arg);
            try {
                if (is_atom(m)) {
                    const handler = $.handlerFor(m);
                    return handler.dispatch(m, ADJ, nil, $);
                }
                else {
                    throw new Error(`adj argument MUST be an atom.`);
                }
            }
            finally {
                m.release();
            }
        }
        finally {
            arg.release();
        }
    }
    finally {
        argList.release();
    }
}
