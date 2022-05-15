import { U } from "../tree";

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

export class Sym implements U {
    /**
     * 
     * @param ln The local part of the qualified name.
     * @param ns The namespace part of the qualified name.
     */
    constructor(public readonly ln: string, public readonly ns?: Sym, public readonly pos?: number, readonly end?: number) {
        // Nothing to see here.
    }
    isCons(): boolean {
        return false;
    }
    isNil(): boolean {
        return false;
    }
    get name(): 'Sym' {
        return 'Sym';
    }
    compare(other: Sym): 1 | -1 | 0 {
        // TODO: Incorporate the namespace.
        return strcmp(this.ln, other.ln);
    }
    contains(needle: U): boolean {
        if (needle instanceof Sym) {
            return this.containsSym(needle);
        }
        return false;
    }
    /**
     * Determines whether other lives in the namespace defined by this.
     */
    containsSym(other: Sym): boolean {
        if (this.equalsSym(other)) {
            return true;
        }
        else {
            if (other.ns) {
                return this.contains(other.ns);
            }
            else {
                return false;
            }
        }
    }
    /**
     * Creates a new symbol with exactly the same local name and namespace as this symbol.
     * However it allows scanning information to be carried along with the new instance.
     * @param pos The start position of the symbol in the source text.
     * @param end The end position of the symbol in the source text.
     */
    clone(pos: number | undefined, end: number | undefined): Sym {
        return new Sym(this.ln, this.ns, pos, end);
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
        if (this.ns) {
            if (other.ns) {
                return this.ns.equalsSym(other.ns) && this.ln === other.ln;
            }
            else {
                return false;
            }
        }
        else {
            if (other.ns) {
                return false;
            }
            else {
                return this.ln === other.ln;
            }
        }
    }
    /**
     * Use this method when you want the QName as a string that can be used to index a map.
     */
    key(): string {
        if (this.ns) {
            return `${this.ns.key()}.${this.ln}`;
        }
        else {
            return this.ln;
        }
    }
    toString(): string {
        return this.key();
        /*
        if (this.ns) {
            return `${this.name}(${JSON.stringify(this.ln)}, ${this.ns.toString()})`;

        }
        else {
            return `${this.name}(${JSON.stringify(this.ln)})`;
        }
        */
    }
}
