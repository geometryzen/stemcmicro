import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";
import { MATH_CONJ } from "./MATH_CONJ";

class ConjSym extends Function1<Sym> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super('conj_sym', MATH_CONJ, is_sym);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Sym, expr: Cons1<Sym, Sym>): [TFLAGS, U] {
        // TODO: Strictly speaking we need the symbol to be a real number.
        return [TFLAG_DIFF, arg];
    }
}

export const conj_sym = mkbuilder(ConjSym);
