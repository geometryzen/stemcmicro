import { U } from "math-expression-tree";
import { is_tensor, Tensor } from "./Tensor";

/**
 * Creates a Tensor from an array of elements. If the elements themselves are tensors,
 * then that elements must be flattened, but the dimensionality is computed and incorporated
 * into the created Tensor.
 */
export function create_tensor(elements: U[], pos?: number, end?: number): Tensor {
    if (elements.length > 0) {
        // The dimensions of the new tensor.
        const dims: number[] = [elements.length];
        /**
         * The elements of the new tensor.
         */
        const elems: U[] = [];
        let seenTensor = false;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (is_tensor(element)) {
                const M = element;
                if (seenTensor) {
                    // Does this tensor have the same dimesions as the previous one?
                } else {
                    for (let j = 0; j < M.ndim; j++) {
                        dims[j + 1] = M.dim(j);
                    }
                    seenTensor = true;
                }
                for (let j = 0; j < M.nelem; j++) {
                    elems.push(M.elem(j));
                }
            } else {
                elems.push(element);
            }
        }
        return new Tensor(dims, elems, pos, end);
    } else {
        return new Tensor([0], [], pos, end);
    }
}
