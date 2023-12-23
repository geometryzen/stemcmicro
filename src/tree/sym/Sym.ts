import { Atom } from "../atom/Atom";
import { Cons, U } from "../tree";

function strcmp(str1: string, str2: string): 0 | 1 | -1 {
    if (str1 === str2) {
        return 0;
    }
    else if (str1 > str2) {
        return 1;
    }
    else {
        return -1;
    }
}

const secretToEnforceUsingCreateSym: number = Math.random();
/**
 * A map of printname to symbol.
 */
const cache: Map<string, Sym> = new Map();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NOOP = (expr: U) => {
    return;
};

export function create_sym(printname: string, pos?: number, end?: number): Sym {
    const cached = cache.get(printname);
    if (cached) {
        return cached;
    }
    const sym = new Sym(secretToEnforceUsingCreateSym, printname, NOOP, pos, end);
    cache.set(printname, sym);
    return sym;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function create_sym_legacy(printname: string, func: (expr: Cons, $: any) => void) {
    const cached = cache.get(printname);
    if (cached) {
        // We can get a race condition between the systems that do and don't store func on the Sym.
        // Resolve the issue by fixing up the func
        if (typeof func === 'function' && cached.func !== func) {
            cached.func = func;
        }
        return cached;
    }
    const sym = new Sym(secretToEnforceUsingCreateSym, printname, func);
    cache.set(printname, sym);
    return sym;
}

export class Sym extends Atom<'Sym'> {
    readonly #text: string;
    func: (expr: Cons, $: unknown) => void;
    /**
     * Use create_sym to create a new Sym instance.
     */
    constructor(secret: number, text: string, func: (expr: Cons, $: unknown) => void, pos?: number, end?: number) {
        super('Sym', pos, end);
        this.#text = text;
        this.func = func;
        if (secret !== secretToEnforceUsingCreateSym) {
            throw new Error("Sym instances must be created using the create_sym function.");
        }
    }
    compare(other: Sym): 1 | -1 | 0 {
        // console.lg("compare", "this", this.ln, "other", other.ln);
        return strcmp(this.#text, other.#text);
    }
    contains(needle: U): boolean {
        if (needle instanceof Sym) {
            return this.equalsSym(needle);
        }
        return false;
    }
    /**
     * Creates a new symbol with exactly the same local name and namespace as this symbol.
     * However it allows scanning information to be carried along with the new instance.
     * @param pos The start position of the symbol in the source text.
     * @param end The end position of the symbol in the source text.
     */
    clone(pos: number | undefined, end: number | undefined): Sym {
        return create_sym(this.#text, pos, end);
    }
    equals(other: U): boolean {
        if (other instanceof Sym) {
            return this.equalsSym(other);
        }
        return false;
    }
    equalsSym(other: Sym): boolean {
        if (this === other) {
            return true;
        }
        else {
            return this.#text === other.#text;
        }
    }
    key(): string {
        return this.#text;
    }
    get printname(): string {
        return this.#text;
    }
    get text(): string {
        return this.#text;
    }
    toString(): string {
        return this.#text;
    }
}
