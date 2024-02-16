import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_rat } from "../rat/is_rat";
import { MATH_CONJ } from "./MATH_CONJ";

class ConjRat extends Function1<Rat> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super('conj_rat', MATH_CONJ, is_rat);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, arg];
    }
}

export const conj_rat = mkbuilder(ConjRat);
