import { HASH_FLT, hash_unaop_atom } from "@stemcmicro/hashing";
import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { SINH } from "../../runtime/constants";
import { create_flt, Flt, zeroAsFlt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";

type ARG = Flt;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Flt"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("sinh_flt", SINH, is_flt);
        this.#hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const d = Math.sinh(arg.d);
        // TODO: There use of this magic constant should be implementation defined.
        if (Math.abs(d) < 1e-10) {
            return [TFLAG_DIFF, zeroAsFlt];
        } else {
            return [TFLAG_DIFF, create_flt(d)];
        }
    }
}

export const sinh_flt = mkbuilder<EXP>(Op);
