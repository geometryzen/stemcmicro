import { determinant } from './det';
import { ExtensionEnv } from './env/ExtensionEnv';
import { halt } from './runtime/defs';
import { stack_push } from './runtime/stack';
import { evaluate_integer } from './scripting/evaluate_integer';
import { is_square_matrix } from './tensor';
import { cadddr, caddr, cadr } from './tree/helpers';
import { Tensor } from './tree/tensor/Tensor';
import { Cons, U } from './tree/tree';

/* cofactor =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
m,i,j

General description
-------------------
Cofactor of a matrix component.
Let c be the cofactor matrix of matrix m, i.e. tranpose(c) = adj(m).
This function returns c[i,j].

*/
export function Eval_cofactor(expr: Cons, $: ExtensionEnv): void {
    const m = $.valueOf(cadr(expr));
    if (!is_square_matrix(m)) {
        halt('cofactor: 1st arg: square matrix expected');
    }
    const n = m.dim(0);

    const i = evaluate_integer(caddr(expr), $);
    if (i < 1 || i > n) {
        halt('cofactor: 2nd arg: row index expected');
    }
    const j = evaluate_integer(cadddr(expr), $);
    if (j < 1 || j > n) {
        halt('cofactor: 3rd arg: column index expected');
    }
    stack_push(cofactor(m, i - 1, j - 1, $));
}

export function cofactor<T extends U>(m: Tensor<T>, row: number, col: number, $: ExtensionEnv): U {
    // console.lg(`ENTERING cofactor(${$.toInfixString(m)}, row = ${row}, col = ${col})`)
    const hook = function (retval: U): U {
        // console.lg(`cofactor(${$.toInfixString(m)}, ${row},${col}) => ${$.toInfixString(retval)}`)
        return retval;
    };
    const n = m.dim(0);
    // console.lg(`n => ${n}`)
    const elements: U[] = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== row && j !== col) {
                elements.push(m.elem(n * i + j));
            }
        }
    }
    // console.lg(`elements => ${items_to_infix(elements, $)}`)

    const det = determinant(elements, n - 1, $);
    if ((row + col) % 2) {
        return hook($.negate(det));
    }
    else {
        return hook(det);
    }
}
