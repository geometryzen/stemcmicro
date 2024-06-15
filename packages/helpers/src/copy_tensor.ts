import { Tensor } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { alloc_tensor } from "./alloc_tensor";

export function copy_tensor<T extends U>(source: Tensor<T>): Tensor<T> {
    const dst = alloc_tensor<T>();
    const ndim = source.ndim;
    for (let i = 0; i < ndim; i++) {
        dst.dims[i] = source.dims[i];
    }
    const nelem = source.nelem;
    for (let i = 0; i < nelem; i++) {
        dst.elems[i] = source.elems[i];
    }
    return dst;
}
