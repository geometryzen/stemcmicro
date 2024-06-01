import { U } from "@stemcmicro/tree";
import { JsAtom } from "../atom/JsAtom";

export class Timestamp extends JsAtom {
    readonly type = "timestamp";
    #date: Date;
    constructor(
        readonly date: Date,
        pos?: number,
        end?: number
    ) {
        super("Timestamp", pos, end);
        if (date instanceof Date) {
            this.#date = date;
        } else {
            throw new Error("date must be an instance of Date.");
        }
    }
    get year(): number {
        return this.#date.getUTCFullYear();
    }
    get month(): number {
        return this.#date.getUTCMonth() + 1;
    }
    get day(): number {
        return this.#date.getUTCDate();
    }
    get hour(): number {
        return this.#date.getUTCHours();
    }
    get minute(): number {
        return this.#date.getUTCMinutes();
    }
    get second(): number {
        return this.#date.getUTCSeconds();
    }
    get millis(): number {
        return this.#date.getUTCMilliseconds();
    }
    toString(): string {
        throw new Error();
    }
}

export function is_timestamp(x: unknown): x is Timestamp {
    return x instanceof Timestamp;
}

export function assert_timestamp(expr: U): Timestamp | never {
    if (is_timestamp(expr)) {
        return expr;
    } else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new Error(`Expecting a Timestamp but got expression ${expr}.`);
    }
}
