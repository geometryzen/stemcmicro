import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { MATH_COS } from "./MATH_COS";
import { transform_cos } from "./transform_cos";

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("cos_any", MATH_COS, is_any);
        this.#hash = hash_unaop_atom(MATH_COS, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        if ($.isExpanding()) {
            return transform_cos(arg, orig, $);
        } else {
            return [TFLAG_NONE, orig];
        }
    }
}

export const cos_any = mkbuilder<EXP>(Op);
