import { Boo, booT, is_rat, one, Rat, Sym } from "@stemcmicro/atoms";
import { Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "@stemcmicro/hashing";
import { ISREAL } from "../../runtime/constants";
import { Function1 } from "../helpers/Function1";

type ARG = Rat;

class Op extends Function1<ARG> {
    readonly #hash: string;
    readonly #true: Boo | Rat;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("is_real_rat", ISREAL, is_rat);
        this.#hash = hash_unaop_atom(this.opr, HASH_RAT);
        this.#true = config.useIntegersForPredicates ? one : booT;
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(): [TFLAGS, U] {
        return [TFLAG_DIFF, this.#true];
    }
}

export const is_real_rat = mkbuilder<Cons1<Sym, ARG>>(Op);
