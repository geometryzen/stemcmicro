import { Atom } from "math-expression-atoms";

export class Uuid extends Atom {
    constructor(readonly str: string, pos?: number, end?: number) {
        super('Uuid', pos, end);
        if (typeof str !== 'string') {
            throw new Error("str must be a string.");
        }
    }
    toString(): string {
        throw new Error();
    }
}

export function is_uuid(x: unknown): x is Uuid {
    return x instanceof Uuid;
}