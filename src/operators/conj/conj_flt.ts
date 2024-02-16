import { is_flt } from "math-expression-atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { MATH_CONJ } from "./MATH_CONJ";

class ConjRat extends Function1<Flt> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super('conj_flt', MATH_CONJ, is_flt);
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, arg];
    }
}

export const conj_flt = mkbuilder(ConjRat);
