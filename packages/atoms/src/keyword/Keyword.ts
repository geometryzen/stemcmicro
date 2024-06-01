import { U } from "@stemcmicro/tree";
import { JsAtom } from "../atom/JsAtom";

function strcmp(str1: string, str2: string): 0 | 1 | -1 {
    if (str1 === str2) {
        return 0;
    } else if (str1 > str2) {
        return 1;
    } else {
        return -1;
    }
}

export class Keyword extends JsAtom {
    readonly type = "keyword";
    constructor(
        readonly localName: string,
        readonly namespace: string,
        pos?: number,
        end?: number
    ) {
        super("Keyword", pos, end);
    }
    compare(other: Keyword): 1 | -1 | 0 {
        const x = strcmp(this.namespace, other.namespace);
        switch (x) {
            case 0: {
                return strcmp(this.localName, other.localName);
            }
            default: {
                return x;
            }
        }
    }
    clone(pos?: number | undefined, end?: number | undefined): Keyword {
        if (typeof pos === "number" && typeof end === "number") {
            return create_keyword_ns(this.localName, this.namespace, pos, end);
        } else {
            return create_keyword_ns(this.localName, this.namespace, this.pos, this.end);
        }
    }
    override equals(other: U): boolean {
        if (other instanceof Keyword) {
            return this.equalsKeyword(other);
        }
        return false;
    }
    equalsKeyword(other: Keyword): boolean {
        if (this === other) {
            return true;
        } else {
            if (this.localName === other.localName) {
                if (this.namespace === other.namespace) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    key(): string {
        if (this.namespace.length > 0) {
            return `:${this.namespace}/${this.localName}`;
        } else {
            return `:${this.localName}`;
        }
    }
    toString(): string {
        return `Keyword(${JSON.stringify(this.localName)}, ${JSON.stringify(this.namespace)})`;
    }
}

export function is_keyword(x: unknown): x is Keyword {
    return x instanceof Keyword;
}

export function assert_keyword(expr: U): Keyword | never {
    if (is_keyword(expr)) {
        return expr;
    } else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new Error(`Expecting a Keyword but got expression ${expr}.`);
    }
}

export function create_keyword(localName: string, pos?: number, end?: number): Keyword {
    return create_keyword_ns(localName, "", pos, end);
}

export function create_keyword_ns(localName: string, namespace: string, pos?: number, end?: number): Keyword {
    return new Keyword(localName, namespace, pos, end);
}
