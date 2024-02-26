import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { hook_create_err } from "../../hooks/hook_create_err";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Flt, piAsFlt, zeroAsFlt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";

const ARG = native_sym(Native.arg);

type ARG = Flt;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('arg_flt', ARG, is_flt);
        this.#hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        if (arg.isZero()) {
            return [TFLAG_DIFF, hook_create_err(expr)];
        }
        else if (arg.isNegative()) {
            return [TFLAG_DIFF, piAsFlt];
        }
        else {
            return [TFLAG_DIFF, zeroAsFlt];
        }
    }
}

export const arg_flt = mkbuilder(Op);
