import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "@stemcmicro/hashing";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";
import { MATH_COS } from "./MATH_COS";
import { transform_cos } from "./transform_cos";

type ARG = Sym;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("cos_sym", MATH_COS, is_sym);
        this.#hash = hash_unaop_atom(MATH_COS, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        // TODO: Optimize.I
        return transform_cos(arg, expr, $);
    }
}

export const cos_sym = mkbuilder(Op);
