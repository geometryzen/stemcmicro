import { ExtensionEnv } from './env/ExtensionEnv';
import { nativeInt } from './nativeInt';
import { halt } from './runtime/defs';
import { stack_push } from './runtime/stack';
import { cadddr, caddr, cadr, cddr } from './tree/helpers';
import { is_tensor } from './tree/tensor/is_tensor';
import { Tensor } from './tree/tensor/Tensor';
import { one, two, zero } from './tree/rat/Rat';
import { NIL, U } from './tree/tree';

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
export function Eval_contract(p1: U, $: ExtensionEnv): void {
    const p1_prime = $.valueOf(cadr(p1));
    let p2: U, p3: U;
    if (NIL.equals(cddr(p1))) {
        p2 = one;
        p3 = two;
    }
    else {
        p2 = $.valueOf(caddr(p1));
        p3 = $.valueOf(cadddr(p1));
    }
    const result = contract(p1_prime, p2, p3, $);
    stack_push(result);
}

function contract(p1: U, p2: U, p3: U, $: ExtensionEnv): U {
    const ai = [];
    const an = [];

    if (!is_tensor(p1)) {
        if (!$.isZero(p1)) {
            halt('contract: tensor expected, 1st arg is not a tensor');
        }
        return zero;
    }

    let l = nativeInt(p2);
    let m = nativeInt(p3);

    const { ndim } = p1;

    if (
        l < 1 ||
        l > ndim ||
        m < 1 ||
        m > ndim ||
        l === m ||
        p1.dim(l - 1) !== p1.dim(m - 1)
    ) {
        halt('contract: index out of range');
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
