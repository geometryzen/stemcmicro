import { Sym } from "@stemcmicro/atoms";
import { Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { MATH_STANDARD_PART } from "./MATH_STANDARD_PART";

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> implements Extension<EXP> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("st_any", MATH_STANDARD_PART, is_any);
        this.#hash = hash_unaop_atom(MATH_STANDARD_PART, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        if ($.isreal(arg)) {
            return [TFLAG_DIFF, arg];
        } else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const st_any = mkbuilder(Op);
