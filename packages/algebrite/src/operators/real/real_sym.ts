import { HASH_SYM, hash_unaop_atom } from "@stemcmicro/hashing";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { REAL } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";

type ARG = Sym;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("real", REAL, is_sym);
        this.#hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        if ($.isreal(arg)) {
            return [TFLAG_NONE, arg];
        } else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const real_sym = mkbuilder(Op);
