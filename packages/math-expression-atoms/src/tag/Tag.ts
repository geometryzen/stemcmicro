import { U } from "math-expression-tree";
import { JsAtom } from "../atom/JsAtom";

const CLASSNAME = "Tag";

export class Tag extends JsAtom {
    readonly type = "tag";
    constructor(
        readonly tag: string,
        readonly value: U,
        pos?: number,
        end?: number
    ) {
        super("Tag", pos, end);
        if (typeof tag !== "string") {
            throw new Error("tag must be a string.");
        }
    }
    toString(): string {
        return `${CLASSNAME}(${JSON.stringify(this.tag)})`;
    }
}

export function is_tag(x: U): x is Tag {
    return x instanceof Tag;
}

export function assert_tag(expr: U): Tag | never {
    if (is_tag(expr)) {
        return expr;
    } else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new Error(`Expecting a Tag but got expression ${expr}.`);
    }
}
