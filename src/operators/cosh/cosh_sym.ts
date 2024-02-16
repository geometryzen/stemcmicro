import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { COSH } from "../../runtime/constants";
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
        super('cosh_sym', COSH, is_sym);
        this.#hash = hash_unaop_atom(COSH, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        return [TFLAG_HALT, expr];
    }
}

export const cosh_sym = mkbuilder(Op);
