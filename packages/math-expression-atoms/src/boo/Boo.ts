import { U } from "math-expression-tree";
import { JsAtom } from "../atom/JsAtom";

const CLASSNAME = "Boo";

/**
 * Fuzzy Logical Boolean.
 */
export class Boo extends JsAtom {
    readonly type = "boolean";
    constructor(
        private readonly b: boolean | undefined,
        pos?: number,
        end?: number
    ) {
        super("boolean", pos, end);
    }
    override equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (other instanceof Boo) {
            return this.equalsBoo(other);
        } else {
            return false;
        }
    }
    equalsBoo(other: Boo): boolean {
        return this.b === other.b;
    }
    isTrue(): boolean {
        if (typeof this.b === "boolean") {
            return this.b;
        } else {
            return false;
        }
    }
    isFalse(): boolean {
        if (typeof this.b === "boolean") {
            return !this.b;
        } else {
            return false;
        }
    }
    override toString(): string {
        if (typeof this.b === "boolean") {
            return this.b ? `${CLASSNAME}(true)` : `${CLASSNAME}(false)`;
        } else {
            return `${CLASSNAME}(undefined)`;
        }
    }
    static valueOf(b: boolean | undefined): Boo {
        if (typeof b === "boolean") {
            return b ? booT : booF;
        } else if (typeof b === "undefined") {
            return booU;
        } else {
            throw new Error();
        }
    }
}

export function create_boo(b: boolean | undefined): Boo {
    return Boo.valueOf(b);
}

export function is_boo(p: unknown): p is Boo {
    return p instanceof Boo;
}

export function assert_boo(expr: U): Boo {
    if (is_boo(expr)) {
        return expr;
    } else {
        throw new Error(`Expecting a Boo but got expression ${expr}.`);
    }
}
export const booT = new Boo(true);
export const booF = new Boo(false);
export const booU = new Boo(void 0);
