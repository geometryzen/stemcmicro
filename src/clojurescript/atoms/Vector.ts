import { Atom } from "math-expression-atoms";
import { U } from "math-expression-tree";

export class Vector extends Atom {
    constructor(readonly elements: U[]) {
        super("Vector");
    }
    toString(): string {
        return `[${this.elements.map((element) => element.toString()).join(' ')}]`;
    }
}

export function is_vector(x: unknown): x is Vector {
    return x instanceof Vector;
}