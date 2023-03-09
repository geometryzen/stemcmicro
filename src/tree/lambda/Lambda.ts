import { ExtensionEnv, LambdaExpr } from "../../env/ExtensionEnv";
import { Atom } from "../atom/Atom";
import { Cons, U } from "../tree";

export class Lambda extends Atom<'Lambda'> {
    readonly #hash: string;
    readonly #impl: LambdaExpr;
    constructor(impl: LambdaExpr, hash: string, pos?: number, end?: number) {
        super('Lambda', pos, end);
        this.#impl = impl;
        this.#hash = hash;
    }
    get hash(): string {
        return this.#hash;
    }
    evaluate(argList: Cons, $: ExtensionEnv): U {
        return this.#impl(argList, $);
    }
    equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (other instanceof Lambda) {
            return true;
        }
        else {
            return false;
        }
    }
    toString(): string {
        return '(lambda ...)';
    }
}