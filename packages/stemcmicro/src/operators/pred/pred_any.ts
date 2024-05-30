import { EnvConfig } from "../../env/EnvConfig";
import { Extension, mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

class Pred extends Function1<U> implements Extension<Cons> {
    readonly name = "pred_any";
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pred_any", create_sym("pred"), is_any);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: U, expr: Cons1<Sym, U>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const pred_any = mkbuilder(Pred);
