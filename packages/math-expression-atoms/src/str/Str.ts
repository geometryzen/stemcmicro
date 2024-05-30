import { U } from "math-expression-tree";
import { JsAtom } from "../atom/JsAtom";

export class Str extends JsAtom {
    readonly type = "string";
    /**
     * @param str The parsed representation of the string. i.e. Delimiters and escaping have been removed.
     * @param pos The zero-based start position of the original text.
     * @param end The zero-based end position of the original text.
     */
    constructor(
        public readonly str: string,
        pos?: number,
        end?: number
    ) {
        super("string", pos, end);
    }
    override equals(other: U): boolean {
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
    override toString(): string {
        // Normally we would return a string that reflects how this object was constructed.
        // This implementation cause Str to behave more like a native JavaScript string.
        return this.str;
    }
}

export function is_str(expr: U): expr is Str {
    return expr instanceof Str;
}

export function assert_str(expr: U): Str {
    if (is_str(expr)) {
        return expr;
    } else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new Error(`Expecting a Str but got expression ${expr}.`);
    }
}

export function create_str(str: string, pos?: number, end?: number): U {
    return new Str(str, pos, end);
}

export const emptyStr = new Str("");
