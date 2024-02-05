import { assert_cons_or_nil, cons, nil, U } from "math-expression-tree";
import { Stack } from "./Stack";

/**
 * A stack of expressions that can be used to support evaluation.
 */
export class StackU {
    readonly #stack: Stack<U>;
    #refCount = 1;
    constructor(elements: U[] = []) {
        const n = elements.length;
        for (let i = 0; i < n; i++) {
            elements[i].addRef();
        }
        this.#stack = new Stack(elements);
    }
    get length(): number {
        return this.#stack.length;
    }
    list(n: number): void {
        this.#stack.push(nil);
        for (let i = 0; i < n; i++) {
            const arg2 = assert_cons_or_nil(this.#stack.pop());
            const arg1 = this.#stack.pop();
            this.#stack.push(cons(arg1, arg2));
        }
    }
    push(element: U): void {
        element.addRef();
        this.#stack.push(element);
    }
    pop(): U {
        return this.#stack.pop();
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            const n = this.#stack.length;
            const elements = this.#stack.popItems(n);
            for (let i = 0; i < n; i++) {
                elements[i].release();
            }
        }
    }
    get refCount(): number {
        return this.#refCount;
    }
    get tos(): number {
        return this.#stack.tos;
    }
}