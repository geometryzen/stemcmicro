import { Shareable } from "@stemcmicro/tree";
import { Stack } from "./Stack";

export class ShareableStack<T extends Shareable> implements Shareable {
    #data: Stack<T> = new Stack();
    #refCount = 1;
    constructor() {
        // Nothing to see here yet.
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount == 0) {
            while (this.#data.length > 0) {
                this.#data.pop().release();
            }
        }
    }
    get length(): number {
        return this.#data.length;
    }
    /**
     * The reference count of the element will be increased by one.
     */
    peek(index: number): T {
        const element = this.#data.peek(index);
        element.addRef();
        return element;
    }
    /**
     * The reference count of the element will be increased by one.
     */
    push(element: T): void {
        element.addRef();
        this.#data.push(element);
    }
    /**
     * The returned element will have a reference count one greater than when it was pushed.
     */
    pop(): T {
        return this.#data.pop();
    }
    some(predicate: (value: T, index: number, array: T[]) => boolean): boolean {
        return this.#data.some(predicate);
    }
}
