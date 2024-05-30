import { Hyp, is_hyp, Sym, zero } from "math-expression-atoms";
import { Cons1, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_HYP, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";
import { MATH_STANDARD_PART } from "./MATH_STANDARD_PART";

type ARG = Hyp;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> implements Extension<EXP> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("st_hyp", MATH_STANDARD_PART, is_hyp);
        this.#hash = hash_unaop_atom(MATH_STANDARD_PART, HASH_HYP);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Hyp, expr: EXP): [TFLAGS, U] {
        return [TFLAG_DIFF, zero];
    }
}

export const st_hyp = mkbuilder(Op);
