import { U } from "math-expression-tree";
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

export function create_sym(localName: string, pos?: number, end?: number, id?: number): Sym {
    return create_sym_ns(localName, "", pos, end, id);
}

export function create_sym_ns(localName: string, namespace: string, pos?: number, end?: number, id?: number): Sym {
    return new Sym(localName, namespace, pos, end, id);
}

function id_must_be_number_or_undefined(x: number | undefined): number | undefined | never {
    if (typeof x === "number") {
        return x;
    } else if (typeof x === "undefined") {
        return x;
    } else {
        throw new Error("id must be number or undefined.");
    }
}

export class Sym extends JsAtom {
    readonly type = "symbol";
    readonly #localName: string;
    readonly #namespace: string;
    readonly #id: number | undefined;
    /**
     * Use create_sym_ns or create_sym to create a new Sym instance.
     */
    constructor(
        localName: string,
        namespace: string,
        readonly pos?: number,
        readonly end?: number,
        id?: number
    ) {
        super("Sym", pos, end);
        this.#localName = localName;
        this.#namespace = namespace;
        this.#id = id_must_be_number_or_undefined(id);
    }
    compare(other: Sym): 1 | -1 | 0 {
        const x = strcmp(this.#namespace, other.#namespace);
        switch (x) {
            case 0: {
                return strcmp(this.#localName, other.#localName);
            }
            default: {
                return x;
            }
        }
    }
    contains(needle: U): boolean {
        if (needle instanceof Sym) {
            return this.equalsSym(needle);
        }
        return false;
    }
    /**
     * Creates a new symbol with exactly the same local name and namespace as this symbol.
     * However it allows scanning information (pos, end) to be carried along with the new instance.
     * @param pos The start position of the symbol in the source text.
     * @param end The end position of the symbol in the source text.
     */
    clone(pos?: number | undefined, end?: number | undefined): Sym {
        if (typeof pos === "number" && typeof end === "number") {
            return create_sym_ns(this.#localName, this.#namespace, pos, end);
        } else {
            return create_sym_ns(this.#localName, this.#namespace, this.pos, this.end);
        }
    }
    override equals(other: U): boolean {
        if (other instanceof Sym) {
            return this.equalsSym(other);
        }
        return false;
    }
    equalsSym(other: Sym): boolean {
        if (this === other) {
            return true;
        } else {
            if (this.#localName === other.#localName) {
                if (this.#namespace === other.#namespace) {
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
        if (this.#namespace.length > 0) {
            return `${this.#namespace}/${this.#localName}`;
        } else {
            return this.#localName;
        }
    }
    get id(): number | undefined {
        return this.#id;
    }
    get localName(): string {
        return this.#localName;
    }
    get namespace(): string {
        return this.#namespace;
    }
    override toString(): string {
        return this.key();
    }
}

export function is_sym(expr: U): expr is Sym {
    return expr instanceof Sym;
}

export function assert_sym(expr: U): Sym {
    if (is_sym(expr)) {
        return expr;
    } else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new Error(`Expecting a Sym but got expression ${expr}.`);
    }
}
