import { U } from "@stemcmicro/tree";
import { JsAtom } from "../atom/JsAtom";

export class JsObject extends JsAtom {
    readonly type = "object";
    #obj: object;
    constructor(obj: object) {
        super("object");
        if (typeof obj === "object") {
            this.#obj = obj;
        } else {
            throw new Error();
        }
    }
    get obj(): object {
        return this.#obj;
    }
}

export function is_jsobject(x: U): x is JsObject {
    return x instanceof JsObject;
}

export function assert_jsobject(x: U): JsObject {
    if (is_jsobject(x)) {
        return x;
    } else {
        throw new Error();
    }
}
