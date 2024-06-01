import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";

const ARG = native_sym(Native.arg);
const MATH_E = native_sym(Native.E);
const PI = native_sym(Native.PI);

type ARG = Sym;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("arg_sym", ARG, is_sym);
        this.#hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        if (arg.equalsSym(MATH_E)) {
            return [TFLAG_DIFF, zero];
        } else if (arg.equalsSym(PI)) {
            return [TFLAG_DIFF, zero];
        } else if ($.isreal(arg)) {
            // The arg could still be zero, undefined, or pi.
            // But we don't know the sign.
            return [TFLAG_NONE, expr];
        } else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const arg_sym = mkbuilder(Op);
