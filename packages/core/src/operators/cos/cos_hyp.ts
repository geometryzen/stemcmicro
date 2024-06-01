import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_HYP, hash_unaop_atom } from "../../hashing/hash_info";
import { Hyp } from "../../tree/hyp/Hyp";
import { one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_hyp } from "../hyp/is_hyp";
import { MATH_COS } from "./MATH_COS";

type ARG = Hyp;
type EXP = Cons1<Sym, ARG>;

/**
 * cos(Hyp) => 1
 */
class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("cos_hyp", MATH_COS, is_hyp);
        this.#hash = hash_unaop_atom(MATH_COS, HASH_HYP);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        return [TFLAG_DIFF, one];
    }
}

export const cos_hyp = mkbuilder<EXP>(Op);
