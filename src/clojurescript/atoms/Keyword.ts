import { Atom } from "math-expression-atoms";

export class Keyword extends Atom {
    constructor(readonly localName: string, readonly namespace: string) {
        super("Keyword");
    }
    toString(): string {
        if (this.namespace.length > 0) {
            return `:${this.namespace}/${this.localName}`;
        }
        else {
            return `:${this.localName}`;
        }
    }
}

export function is_keyword(x: unknown): x is Keyword {
    return x instanceof Keyword;
}