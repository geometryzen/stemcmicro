import { Rat, zero } from "@stemcmicro/atoms";
import { HASH_RAT, hash_unaop_atom } from "@stemcmicro/hashing";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { SINH } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_rat } from "../rat/is_rat";

type ARG = Rat;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("sinh_rat", SINH, is_rat);
        this.#hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        if (arg.isZero()) {
            return [TFLAG_DIFF, zero];
        } else {
            return [TFLAG_HALT, expr];
        }
    }
}

export const sinh_rat = mkbuilder<EXP>(Op);
