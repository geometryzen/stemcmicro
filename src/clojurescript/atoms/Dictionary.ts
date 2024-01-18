import { Atom } from "math-expression-atoms";
import { U } from "math-expression-tree";

export class Dictionary extends Atom {
    constructor(readonly elements: U[]) {
        super('Map');
    }
    toString(): string {
        // This is only for debugging.
        throw new Error(`{${this.elements.map((element) => element.toString()).join(' ')}}`);
        // return `{${this.elements.map((element) => element.toString()).join(' ')}}`;
    }
}

export function is_dictionary(x: unknown): x is Dictionary {
    return x instanceof Dictionary;
}