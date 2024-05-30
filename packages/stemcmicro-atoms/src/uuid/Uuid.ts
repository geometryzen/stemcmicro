import { U } from "@stemcmicro/tree";
import { JsAtom } from "../atom/JsAtom";

export class Uuid extends JsAtom {
    readonly type = "uuid";
    constructor(
        readonly str: string,
        pos?: number,
        end?: number
    ) {
        super("Uuid", pos, end);
        if (typeof str !== "string") {
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

export function assert_uuid(expr: U): Uuid | never {
    if (is_uuid(expr)) {
        return expr;
    } else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new Error(`Expecting a Uuid but got expression ${expr}.`);
    }
}
