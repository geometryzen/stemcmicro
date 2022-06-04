import { Atom } from "../atom/Atom";
import { U } from "../tree";

/**
 * TODO: This class SHOULD (MUST) be escaping the string and the printer SHOULD NOT not then need to escape.
 * By escaping here, this class gets written into expression correctly.
 * As it works now, if we escape here then tests break because of double-duty escaping.
 */
export class Str extends Atom {
    /**
     * @param str The parsed representation of the string. i.e. Delimiters and escaping have been removed.
     * @param pos The zero-based start position of the original text.
     * @param end The zero-based end position of the original text.
     */
    constructor(public readonly str: string, pos?: number, end?: number) {
        super('Str', pos, end);
    }
    equals(other: U): boolean {
        if (other instanceof Str) {
            return this.equalsStr(other);
        }
        return false;
    }
    equalsStr(other: Str): boolean {
        if (this === other) {
            return true;
        }
        return this.str === other.str;
    }
    toInfixString(): string {
        return JSON.stringify(this.str);
    }
    toListString(): string {
        return JSON.stringify(this.str);
    }
    toString(): string {
        return `${this.name}(${this.str})`;
    }
}

export const emptyStr = new Str('');
