import { JsAtom } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { LambdaExpr } from "./LambdaExpr";

export class Lambda extends JsAtom {
    readonly type = "lambda";
    readonly #hash: string;
    readonly #body: LambdaExpr;
    constructor(body: LambdaExpr, hash: string, pos?: number, end?: number) {
        super("Lambda", pos, end);
        this.#body = body;
        this.#hash = hash;
    }
    get hash(): string {
        return this.#hash;
    }
    get body(): LambdaExpr {
        return this.#body;
    }
    override equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (other instanceof Lambda) {
            return true;
        } else {
            return false;
        }
    }
    override toString(): string {
        return `Lambda(${this.#body})`;
    }
}

export function is_lambda(expr: U): expr is Lambda {
    return expr instanceof Lambda;
}
