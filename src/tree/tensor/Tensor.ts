import { is_tensor } from "../../operators/tensor/is_tensor";
import { Atom } from "../atom/Atom";
import { U } from "../tree";

function equals_number_arrays(arrL: number[], arrR: number[]): boolean {
    if (arrL.length === arrR.length) {
        for (let i = 0; i < arrL.length; i++) {
            if (arrL[i] !== arrR[i]) {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
}

function equals_U_arrays(arrL: U[], arrR: U[]): boolean {
    if (arrL.length === arrR.length) {
        for (let i = 0; i < arrL.length; i++) {
            if (!arrL[i].equals(arrR[i])) {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
}

/**
 * A matrix. This may be used to represent a tensor.
 * While the syntactic representation of a tensor is that of nested arrays,
 * the elements of the tensor are stored in a flattened manner. Presumambly,
 * this makes things easier in the case when a Tensor is used as a square matrix.
 */
export class Tensor<T extends U = U> extends Atom<'Tensor'> {
    readonly #dims: number[];
    readonly #elems: T[];
    /**
     * @param dims The lengths of each dimension.
     * @param elems The elements containing all the data.
     */
    constructor(dims: number[], elems: T[], pos?: number, end?: number) {
        super('Tensor', pos, end);
        this.#dims = dims;
        this.#elems = elems;
    }
    public get dims(): number[] {
        return this.#dims;
    }
    public get elems(): T[] {
        return this.#elems;
    }
    public get rank(): number {
        for (const elem of this.#elems) {
            if (is_tensor(elem)) {
                return this.#dims.length + elem.rank;
            }
        }
        return this.#dims.length;
    }
    public get ndim(): number {
        return this.#dims.length;
    }
    public get nelem(): number {
        return this.#elems.length;
    }
    contains(needle: U): boolean {
        if (this.equals(needle)) {
            return true;
        }
        return this.someElements(function (element) {
            return element.contains(needle);
        });
    }
    copyDimensions(): number[] {
        return [...this.#dims];
    }
    /**
     * Returns a copy of the data in this tensor.
     */
    copyElements(): T[] {
        return [...this.#elems];
    }
    /**
     * Returns the size of the specified dimension.
     * This is the number of elements at the specified level of nesting.
     * @param n The zero-based index of the dimension.
     */
    dim(n: number): number {
        if (n < 0) {
            throw new Error(`n must be greater than or equal to zero.`);
        }
        if (n > this.#dims.length - 1) {
            throw new Error(`n + 1 must be less than ndim.`);
        }
        return this.#dims[n];
    }
    elem(index: number): T {
        return this.#elems[index];
    }
    equals(other: U): boolean {
        if (other instanceof Tensor) {
            if (equals_number_arrays(this.#dims, other.#dims)) {
                if (equals_U_arrays(this.#elems, other.#elems)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Applies the predicate to every element of this tensor.
     * @param predicate The predicate applied.
     * @returns true if every element satisfies the predicate.
     */
    everyElement(predicate: (element: T) => boolean): boolean {
        return this.#elems.every(predicate);
    }
    filterElements(callbackfn: (value: T, index: number, array: T[]) => boolean): U[] {
        return this.#elems.filter(callbackfn);
    }
    map<X extends U>(callbackfn: (value: T, index: number, array: T[]) => X): Tensor<X> {
        return this.withElements(this.#elems.map(callbackfn));
    }
    mapElements<X>(callbackfn: (value: T, index: number, array: T[]) => X): X[] {
        return this.#elems.map(callbackfn);
    }
    isCons(): boolean {
        return false;
    }
    /**
     * @override
     */
    isNil(): boolean {
        return false;
    }
    sameDimensions(other: Tensor): boolean {
        if (this.ndim !== other.ndim) {
            return false;
        }
        return this.#dims.every((size, i) => size === other.dim(i));
    }
    sliceDimensions(start?: number, end?: number): number[] {
        return this.#dims.slice(start, end);
    }
    someElements(callbackfn: (value: T, index: number, array: T[]) => boolean): boolean {
        return this.#elems.some(callbackfn);
    }
    toInfixString(): string {
        return '<tensor>';
    }
    toListString(): string {
        return '<tensor>';
    }
    toString(): string {
        return `${this.name}(ndim=${this.ndim}, dim=[${this.#dims}], elems=[${this.#elems.map(function (elem) {
            return `${elem}`;
        }).join(',')}])`;
    }
    /**
     * Returns a new tensor with the same dimensions as this, but with different elements.
     * This element avoids the copy of the dims array.
     */
    withElements<X extends U>(elems: X[]): Tensor<X> {
        return new Tensor(this.#dims, elems);
    }
}
