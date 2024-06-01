import { is_rat, Rat, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { half } from "../../tree/rat/Rat";
import { Function1 } from "../helpers/Function1";

export const MATH_SQRT = native_sym(Native.sqrt);

/**
 * sqrt(x: Rat) => (pow x 1/2)
 */
class Op extends Function1<Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("sqrt_rat", MATH_SQRT, is_rat);
        this.#hash = hash_unaop_atom(MATH_SQRT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Rat, orig: Cons1<Sym, Rat>, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, `${arg}`);
        return [TFLAG_DIFF, $.power(arg, half)];
    }
}

export const sqrt_rat = mkbuilder(Op);
