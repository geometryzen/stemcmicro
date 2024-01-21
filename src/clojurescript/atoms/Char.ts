import { Atom } from "math-expression-atoms";

export class Char extends Atom {
    constructor(readonly ch: string, pos?: number, end?: number) {
        super('Char', pos, end);
        if (typeof ch !== 'string') {
            throw new Error("ch must be a string.");
        }
    }
    toString(): string {
        throw new Error();
    }
}

export function is_char(x: unknown): x is Char {
    return x instanceof Char;
}