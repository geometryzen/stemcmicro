import { Extension, ExtensionBuilder, ExtensionEnv, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { HERMITE } from "../../runtime/constants";
import { Cons, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { eval_hermite } from "./eval_hermite";

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new Op();
    }
}

class Op extends FunctionVarArgs implements Extension<Cons> {
    readonly #hash: string;
    constructor() {
        super('hermite', HERMITE);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        if ($.isExpanding()) {
            const retval = eval_hermite(expr, $);
            const changed = !retval.equals(expr);
            return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const hermite_varargs = new Builder();
