import { StackU } from "@stemcmicro/stack";
import { U } from "@stemcmicro/tree";

/**
 * A box that contains something, or not.
 * Primarily being used to minimize casting in the mainline and to prevent the stack from being a distraction.
 */
export class Box {
    readonly #stack = new StackU([]);
    constructor(contents: U) {
        this.#stack.push(contents);
    }
    peek(): U {
        return this.#stack.getAt(0);
    }
    pop(): U {
        return this.#stack.pop();
    }
    push(contents: U) {
        this.#stack.push(contents);
    }
}
