import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_HYP, hash_unaop_atom } from "../../hashing/hash_info";
import { Hyp } from "../../tree/hyp/Hyp";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_hyp } from "../hyp/is_hyp";

export const MATH_SIN = native_sym(Native.sin);

type ARG = Hyp;
type EXP = Cons1<Sym, ARG>;

/**
 * sin(Hyp) => Hyp
 */
class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("sin_hyp", MATH_SIN, is_hyp);
        this.#hash = hash_unaop_atom(MATH_SIN, HASH_HYP);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        return [TFLAG_DIFF, arg];
    }
}

export const sin_hyp = mkbuilder<EXP>(Op);
