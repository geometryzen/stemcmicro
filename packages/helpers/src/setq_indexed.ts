import { is_sym, is_tensor, Tensor } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { cadnr, car, cdr, Cons, is_cons, nil, U } from "@stemcmicro/tree";
import { num_to_number } from "./num_to_number";

//-----------------------------------------------------------------------------
/**
 * a[i1][i2][i3]... = b
 * @param assignExpr (= (index a i1 i2 i3 ...) b)
 */
export function setq_indexed(assignExpr: Cons, $: Pick<ExprContext, "setBinding" | "valueOf">): Cons {
    const lhs = cadnr(assignExpr, 1);
    const a_and_indices = cdr(lhs);
    const rhs = cadnr(assignExpr, 2);
    const a = car(a_and_indices);
    const indices = cdr(a_and_indices);
    if (!is_sym(a)) {
        throw new Error("indexed assignment: expected a symbol name");
    }
    const idxs: U[] = [];
    if (is_cons(indices)) {
        const items = [...indices].map(function (x) {
            return $.valueOf(x);
        });
        while (items.length > 0) {
            idxs.push(items.shift());
        }
    }
    const matrix = $.valueOf(a);
    if (is_tensor(matrix)) {
        const value = set_tensor_component(matrix, idxs, $.valueOf(rhs));
        $.setBinding(a, value);
        return nil;
    } else {
        throw new Error("error in indexed assign: assigning to something that is not a tensor");
    }
}

function set_tensor_component(lhs: Tensor<U>, indices: U[], rhs: U): Tensor<U> {
    /**
     * The number of indices
     */
    const n = indices.length;

    if (n > lhs.ndim) {
        // too many indices for the tensor.
        throw new Error("error in indexed assign");
    }

    let k = 0;
    for (let i = 0; i < n; i++) {
        const t = num_to_number(indices[i]);
        if (t < 1 || t > lhs.dim(i)) {
            // index value must be in range.
            throw new Error("error in indexed assign\n");
        }
        k = k * lhs.dim(i) + t - 1;
    }

    for (let i = n; i < lhs.ndim; i++) {
        k = k * lhs.dim(i) + 0;
    }

    const dims = lhs.copyDimensions();
    const elems = lhs.copyElements();

    if (lhs.ndim === n) {
        if (is_tensor(rhs)) {
            throw new Error("error in indexed assign");
        }
        elems[k] = rhs as U;

        return new Tensor(dims, elems);
    }

    // see if the rvalue matches
    if (!is_tensor(rhs)) {
        throw new Error("error in indexed assign");
    }

    if (lhs.ndim - n !== rhs.ndim) {
        throw new Error("error in indexed assign");
    }

    for (let i = 0; i < rhs.ndim; i++) {
        if (dims[n + i] !== rhs.dim(i)) {
            throw new Error("error in indexed assign");
        }
    }

    // copy rvalue
    for (let i = 0; i < rhs.nelem; i++) {
        elems[k + i] = rhs.elem(i);
    }

    return new Tensor(dims, elems);
}
