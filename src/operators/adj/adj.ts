import { ExtensionEnv } from '../../env/ExtensionEnv';
import { assert_square_matrix_tensor } from '../../tensor';
import { Tensor } from '../../tree/tensor/Tensor';
import { car, Cons, U } from '../../tree/tree';
import { cofactor } from '../cofactor/cofactor';
import { is_tensor } from '../tensor/is_tensor';

/* adj =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
m

General description
-------------------
Returns the adjunct of matrix m. The inverse of m is equal to adj(m) divided by det(m).

*/
export function Eval_adj(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.cdr;
    const arg = car(argList);
    const m = $.valueOf(arg);
    if (is_tensor(m)) {
        const result = adj(m, $);
        return result;
    }
    else {
        throw new Error(`adj argument MUST be a tensor.`);
    }
}

export function adj(M: Tensor, $: ExtensionEnv): U {
    const hook = function (retval: U): U {
        // console.lg(`adj of ${$.toInfixString(M)} => ${$.toInfixString(retval)}`);
        return retval;
    };
    const n = assert_square_matrix_tensor(M, $);
    const elems = new Array<U>(M.nelem);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            elems[n * j + i] = cofactor(M, i, j, $);
        }
    }
    return hook(M.withElements(elems));
}
