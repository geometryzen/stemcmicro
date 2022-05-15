import { ExtensionEnv } from "../env/ExtensionEnv";
import { nativeInt } from "../nativeInt";
import { Tensor } from "../tree/tensor/Tensor";
import { U } from "../tree/tree";

/**
 * TODO: This would be better if the tensor was not part of the indices.
 * @param stack 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function index_function(stack: U[], $: ExtensionEnv): U {
    // console.lg(`index_function ${items_to_infix(stack, $)}`);
    const s = 0;
    const p1: Tensor = stack[s] as Tensor;

    const { ndim } = p1;

    const m = stack.length - 1;

    if (m > ndim) {
        throw new Error('too many indices for tensor');
    }

    let k = 0;

    for (let i = 0; i < m; i++) {
        const t = nativeInt(stack[s + i + 1]);
        if (t < 1 || t > p1.dim(i)) {
            throw new Error('index out of range');
        }
        k = k * p1.dim(i) + t - 1;
    }

    if (ndim === m) {
        return p1.elem(k);
    }

    k = p1.sliceDimensions(m).reduce((a, b) => a * b, k);
    const nelem = p1.sliceDimensions(m).reduce((a, b) => a * b, 1);

    const dims = p1.sliceDimensions(m);
    const elems = new Array<U>(nelem);

    for (let i = 0; i < nelem; i++) {
        elems[i] = p1.elem(k + i);
    }

    return new Tensor(dims, elems);
}
