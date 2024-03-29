import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const ARG = native_sym(Native.arg);
const ABS = native_sym(Native.abs);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ARG, ABS);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, expExpr: Cons, argExpr: Cons): [TFLAGS, U] {
        return [TFLAG_NONE, zero];
    }
}

export const arg_abs = mkbuilder(Op);
