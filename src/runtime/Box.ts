/**
 * A box that contains something, or not.
 * Primarily being used to minimize casting in the mainline and to prevent the stack from being a distraction.
 * TODO: Methods could support some invariant checking.
 */
export class Box<U> {
    readonly #stack: U[] = [];
    constructor(contents: U) {
        this.#stack.push(contents);
    }
    peek(): U {
        return this.#stack[0];
    }
    pop(): U {
        return this.#stack.pop() as U;
    }
    push(contents: U) {
        this.#stack.push(contents);
    }
}