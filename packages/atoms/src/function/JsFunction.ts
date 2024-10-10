import { U } from "@stemcmicro/tree";
import { JsAtom } from "../atom/JsAtom";

export class JsFunction extends JsAtom {
    readonly type = "function";
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    #fn: Function;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    constructor(fn: Function) {
        super("function");
        if (typeof fn === "function") {
            this.#fn = fn;
        } else {
            throw new Error();
        }
    }
    get fn(): object {
        return this.#fn;
    }
}

export function is_jsfunction(x: U): x is JsFunction {
    return x instanceof JsFunction;
}

export function assert_jsfunction(x: U): JsFunction {
    if (is_jsfunction(x)) {
        return x;
    } else {
        throw new Error();
    }
}
