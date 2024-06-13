import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Flt, zeroAsFlt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";

const IM = native_sym(Native.imag);

type ARG = Flt;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("imag_flt", IM, is_flt);
        this.#hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        return [TFLAG_NONE, zeroAsFlt];
    }
}

export const imag_flt = mkbuilder(Op);
