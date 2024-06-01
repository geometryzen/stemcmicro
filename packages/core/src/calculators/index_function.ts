import { nativeInt } from "../nativeInt";
import { Tensor } from "../tree/tensor/Tensor";
import { U } from "../tree/tree";

export function index_function(tensor: Tensor, indices: U[]): U {
    // This implementation makes it clear that we expect that the elements of the tensor are stored
    // in a "flattened" way. That is, they don't have the structure that you might expect from the
    // syntactic (nested) representation. What is surprising is that does not seem to align with the scanning
    // procedure.
    // console.lg(`index_function tensor=${tensor} indices=${indices}`);
    const ndim = tensor.ndim;

    const m = indices.length;

    if (m > ndim) {
        throw new Error("too many indices for tensor");
    }

    let k = 0;

    for (let i = 0; i < m; i++) {
        const idx = nativeInt(indices[i]);
        if (idx < 1 || idx > tensor.dim(i)) {
            throw new Error("index out of range");
        }
        //
        k = k * tensor.dim(i) + idx - 1;
    }

    // In the case where we are accessing the tensor down to the lowest level...
    if (ndim === m) {
        return tensor.elem(k);
    }

    // When not going down to the lowest level, we have to create a tensor wrapper.
    k = tensor.sliceDimensions(m).reduce((a, b) => a * b, k);
    const nelem = tensor.sliceDimensions(m).reduce((a, b) => a * b, 1);

    const dims = tensor.sliceDimensions(m);
    const elems = new Array<U>(nelem);

    for (let i = 0; i < nelem; i++) {
        elems[i] = tensor.elem(k + i);
    }

    return new Tensor(dims, elems);
}
