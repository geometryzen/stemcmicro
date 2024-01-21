import { Atom } from "math-expression-atoms";
import { U } from "math-expression-tree";

export class Tag extends Atom {
    constructor(readonly tag: string, readonly value: U, pos?: number, end?: number) {
        super('Tag', pos, end);
        if (typeof tag !== 'string') {
            throw new Error("tag must be a string.");
        }
    }
    toString(): string {
        throw new Error();
    }
}

export function is_tag(x: U): x is Tag {
    return x instanceof Tag;
}