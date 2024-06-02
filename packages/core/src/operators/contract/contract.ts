import { ExtensionEnv } from "../../env/ExtensionEnv";
import { num_to_number } from "../../nativeInt";
import { halt } from "../../runtime/defs";
import { cadddr, caddr, cddr } from "../../tree/helpers";
import { one, two, zero } from "../../tree/rat/Rat";
import { Tensor } from "../../tree/tensor/Tensor";
import { Cons, nil, U } from "../../tree/tree";
import { is_tensor } from "../tensor/is_tensor";

/* contract =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
a,i,j

General description
-------------------
Contract across tensor indices i.e. returns "a" summed over indices i and j.
If i and j are omitted then 1 and 2 are used.
contract(m) is equivalent to the trace of matrix m.

*/
export function eval_contract(contractExpr: Cons, $: ExtensionEnv): U {
    const a = $.valueOf(contractExpr.argList.head);
    let p2: U, p3: U;
    if (nil.equals(cddr(contractExpr))) {
        p2 = one;
        p3 = two;
    } else {
        p2 = $.valueOf(caddr(contractExpr));
        p3 = $.valueOf(cadddr(contractExpr));
    }
    const result = contract(a, p2, p3, $);
    return result;
}

function contract(p1: U, p2: U, p3: U, $: ExtensionEnv): U {
    // console.lg(`contract ${print_expr(p1, $)} ${print_expr(p2, $)} ${print_expr(p3, $)}`);
    const ai = [];
    const an = [];

    if (!is_tensor(p1)) {
        if (!$.iszero(p1)) {
            halt("contract: tensor expected, 1st arg is not a tensor");
        }
        return zero;
    }

    let l = num_to_number(p2);
    let m = num_to_number(p3);

    const { ndim: ndim } = p1;

    if (l < 1 || l > ndim || m < 1 || m > ndim || l === m || p1.dim(l - 1) !== p1.dim(m - 1)) {
        halt("contract: index out of range");
    }

    l--;
    m--;

    const n = p1.dim(l);

    // nelem is the number of elements in "b"

    let nelem = 1;
    for (let i = 0; i < ndim; i++) {
        if (i !== l && i !== m) {
            nelem *= p1.dim(i);
        }
    }

    const dims = new Array<number>(ndim - 2);
    const elems = new Array<U>(nelem);

    let j = 0;
    for (let i = 0; i < ndim; i++) {
        if (i !== l && i !== m) {
            dims[j++] = p1.dim(i);
        }
    }

    const a = p1.copyElements();
    const b = elems;

    for (let i = 0; i < ndim; i++) {
        ai[i] = 0;
        an[i] = p1.dim(i);
    }

    for (let i = 0; i < nelem; i++) {
        let temp: U = zero;
        for (let j = 0; j < n; j++) {
            ai[l] = j;
            ai[m] = j;
            let h = 0;
            for (let k = 0; k < ndim; k++) {
                h = h * an[k] + ai[k];
            }
            // console.lg "a[h]: " + a[h]
            temp = $.add(temp, a[h]);
        }
        // console.lg "tos: " + stack[tos-1]
        b[i] = temp;
        // console.lg "b[i]: " + b[i]
        for (let j = ndim - 1; j >= 0; j--) {
            if (j === l || j === m) {
                continue;
            }
            if (++ai[j] < an[j]) {
                break;
            }
            ai[j] = 0;
        }
    }

    if (nelem === 1) {
        return b[0];
    }

    return new Tensor(dims, elems);
}
