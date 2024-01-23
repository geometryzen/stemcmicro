import { Atom } from "math-expression-atoms";

export class Keyword extends Atom {
    constructor(readonly localName: string, readonly namespace: string, pos?: number, end?: number) {
        super("Keyword", pos, end);
    }
    key(): string {
        if (this.namespace.length > 0) {
            return `:${this.namespace}/${this.localName}`;
        }
        else {
            return `:${this.localName}`;
        }
    }
    toString(): string {
        return `Keyword(${JSON.stringify(this.localName)},${JSON.stringify(this.namespace)})`;
    }
}

export function is_keyword(x: unknown): x is Keyword {
    return x instanceof Keyword;
}