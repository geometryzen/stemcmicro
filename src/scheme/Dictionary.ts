import { Atom } from "math-expression-atoms";
import { U } from "math-expression-tree";

export class Dictionary extends Atom {
    constructor(readonly elements: U[]) {
        super("Dictionary");
    }
    toString(): string {
        return `{${this.elements.map((element) => element.toString()).join(' ')}}`;
    }
}

export function is_dictionary(x: unknown): x is Dictionary {
    return x instanceof Dictionary;
}