import { is_tensor, Tensor } from 'math-expression-atoms';
import { Cons, U } from 'math-expression-tree';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { assert_square_matrix_tensor } from '../../tensor';
import { cofactor } from '../cofactor/cofactor';

export function Eval_adj(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        return lambda_adj(argList, $);
    }
    finally {
        argList.release();
    }
}

function lambda_adj(argList: Cons, $: ExtensionEnv): U {
    const arg = argList.head;
    try {
        const m = $.valueOf(arg);
        try {
            if (is_tensor(m)) {
                return adj(m, $);
            }
            else {
                throw new Error(`adj argument MUST be a tensor.`);
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

export function adj(m: Tensor, $: ExtensionEnv): U {
    const n = assert_square_matrix_tensor(m);
    const elems = new Array<U>(m.nelem);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            elems[n * j + i] = cofactor(m, i, j, $);
        }
    }
    return m.withElements(elems);
}
