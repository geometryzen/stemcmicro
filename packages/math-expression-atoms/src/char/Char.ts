import { U } from "math-expression-tree";
import { JsAtom } from "../atom/JsAtom";

export class Char extends JsAtom {
    readonly type = "char";
    constructor(
        readonly ch: string,
        pos?: number,
        end?: number
    ) {
        super("Char", pos, end);
        if (typeof ch !== "string") {
            throw new Error("ch must be a string.");
        }
    }
    toString(): string {
        return `${this.name}(${JSON.stringify(this.ch)})`;
    }
}

export function is_char(x: unknown): x is Char {
    return x instanceof Char;
}

export function assert_char(expr: U): Char | never {
    if (is_char(expr)) {
        return expr;
    } else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new Error(`Expecting a Char but got expression ${expr}.`);
    }
}
