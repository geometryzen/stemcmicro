import { Atom } from "math-expression-atoms";
import { U } from "math-expression-tree";

export class Set extends Atom {
    /**
     * @param members
     * @param pos
     * @param end 
     */
    constructor(readonly members: U[], pos?: number, end?: number) {
        super('Set', pos, end);
        if (!Array.isArray(members)) {
            throw new Error("members must be an Array");
        }
    }
    toString(): string {
        // This is only for debugging.
        throw new Error(`{${this.members.map((element) => element.toString()).join(' ')}}`);
        // return `{${this.elements.map((element) => element.toString()).join(' ')}}`;
    }
}

export function is_set(x: unknown): x is Set {
    return x instanceof Set;
}