import { create_sym, is_rat, Rat, Sym } from "math-expression-atoms";
import { Cons1, U } from "math-expression-tree";
import { Extension, ExtensionBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new SuccRat();
    }
}

class SuccRat extends Function1<Rat> implements Extension<U> {
    readonly #hash: string;
    constructor() {
        super('succ_rat', create_sym('succ'), is_rat);
        this.#hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Rat, expr: Cons1<Sym, Rat>): [TFLAGS, U] {
        return [TFLAG_DIFF, arg.succ()];
    }
}

export const succ_rat = new Builder();
