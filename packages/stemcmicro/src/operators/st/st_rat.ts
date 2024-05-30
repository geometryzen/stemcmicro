import { is_rat, Rat, Sym } from "math-expression-atoms";
import { Cons1, U } from "math-expression-tree";
import { Extension, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";
import { MATH_STANDARD_PART } from "./MATH_STANDARD_PART";

type ARG = Rat;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> implements Extension<EXP> {
    readonly #hash: string;
    constructor() {
        super("st_rat", MATH_STANDARD_PART, is_rat);
        this.#hash = hash_unaop_atom(MATH_STANDARD_PART, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        return [TFLAG_DIFF, arg];
    }
}

export const st_rat = mkbuilder(Op);
