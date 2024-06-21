import { Extension, ExtensionBuilder, ExtensionEnv, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "@stemcmicro/hashing";
import { BINOMIAL } from "../../runtime/constants";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { eval_binomial } from "./binomial";

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new Op();
    }
}

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor() {
        super("binomial", BINOMIAL);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_binomial(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const binomial_varargs = new Builder();
