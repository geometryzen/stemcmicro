import { is_tensor } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { negate } from "@stemcmicro/helpers";
import { halt } from "../../runtime/defs";
import { evaluate_integer } from "../../scripting/evaluate_integer";
import { is_square_matrix } from "../../tensor";
import { cadddr, caddr, cadr } from "../../tree/helpers";
import { Tensor } from "../../tree/tensor/Tensor";
import { Cons, U } from "../../tree/tree";
import { determinant_symbolic } from "../det/det";

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
export function eval_cofactor(expr: Cons, $: ExprContext): U {
    const m = $.valueOf(cadr(expr));
    if (is_tensor(m) && is_square_matrix(m)) {
        const n = m.dim(0);

        const i = evaluate_integer(caddr(expr), $);
        if (i < 1 || i > n) {
            halt("cofactor: 2nd arg: row index expected");
        }
        const j = evaluate_integer(cadddr(expr), $);
        if (j < 1 || j > n) {
            halt("cofactor: 3rd arg: column index expected");
        }
        return cofactor(m, i - 1, j - 1, $);
    } else {
        halt("cofactor: 1st arg: square matrix expected");
    }
}

export function cofactor<T extends U>(m: Tensor<T>, row: number, col: number, $: Pick<ExprContext, "valueOf">): U {
    const hook = function (retval: U): U {
        return retval;
    };
    const n = m.dim(0);

    const elements: U[] = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== row && j !== col) {
                elements.push(m.elem(n * i + j));
            }
        }
    }

    const det = determinant_symbolic(elements, n - 1, $);
    if ((row + col) % 2) {
        return hook(negate($, det));
    } else {
        return hook(det);
    }
}
