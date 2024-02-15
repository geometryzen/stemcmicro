import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { create_flt, Flt, zeroAsFlt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Function1 } from "../helpers/Function1";

export const MATH_SIN = native_sym(Native.sin);

class Op extends Function1<Flt> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('sin_flt', MATH_SIN, is_flt);
        this.#hash = hash_unaop_atom(MATH_SIN, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        const d = Math.sin(arg.d);
        // TODO: The magic number here should be a parameter treatSinFltAsZero...
        if (Math.abs(d) < 1e-10) {
            return [TFLAG_DIFF, zeroAsFlt];
        }
        else {
            return [TFLAG_DIFF, create_flt(d)];
        }
    }
}

export const sin_flt = mkbuilder(Op);
