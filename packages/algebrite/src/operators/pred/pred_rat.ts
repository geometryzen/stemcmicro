import { create_sym, is_rat, Rat, Sym } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "@stemcmicro/hashing";
import { Function1 } from "../helpers/Function1";

class PredRat extends Function1<Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pred_rat", create_sym("pred"), is_rat);
        this.#hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, arg.pred()];
    }
}

export const pred_rat = mkbuilder(PredRat);
