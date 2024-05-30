import { U } from "math-expression-tree";
import { zero } from "../rat/Rat";
import { Tensor } from "./Tensor";

export function create_tensor_elements_zero(dims: number[], nelem: number, pos?: number, end?: number): Tensor<U> {
    const elems = create_tensor_elements(nelem, zero);
    return new Tensor<U>(dims, elems, pos, end);
}

/**
 *
 * @param nelem The total number of elements.
 * @param value The value to use for each element.
 */
export function create_tensor_elements<T extends U>(nelem: number, value: T): T[] {
    const elems = new Array<T>(nelem);
    for (let i = 0; i < nelem; i++) {
        elems[i] = value;
    }
    return elems;
}

export function create_tensor_elements_diagonal<T extends U>(n: number, diagValue: T, otherValue: T): T[] {
    const elems = create_tensor_elements(n * n, otherValue);
    for (let i = 0; i < n; i++) {
        elems[n * i + i] = diagValue;
    }
    return elems;
}
