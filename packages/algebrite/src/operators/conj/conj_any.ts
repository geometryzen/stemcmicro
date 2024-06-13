import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

const CONJ = native_sym(Native.conj);

class Op extends Function1<U> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super("conj_any", CONJ, is_any);
    }
    transform1(opr: Sym, arg: U, expr: Cons1<Sym, U>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const conj_any = mkbuilder(Op);
