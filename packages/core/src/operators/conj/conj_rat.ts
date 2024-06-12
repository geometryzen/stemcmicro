import { is_rat, Rat, Sym } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Function1 } from "../helpers/Function1";
import { MATH_CONJ } from "./MATH_CONJ";

class ConjRat extends Function1<Rat> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super("conj_rat", MATH_CONJ, is_rat);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, arg];
    }
}

export const conj_rat = mkbuilder(ConjRat);
