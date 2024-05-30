import { create_sym, Sym } from "@stemcmicro/atoms";
import { Cons, Cons1, U } from "@stemcmicro/tree";
import { Extension, ExtensionBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new Succ();
    }
}

class Succ extends Function1<U> implements Extension<Cons> {
    readonly #hash: string;
    constructor() {
        super("succ_any", create_sym("succ"), is_any);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: U, expr: Cons1<Sym, U>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const succ_any = new Builder();
