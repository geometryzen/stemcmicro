import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const SIN = native_sym(Native.sin);
const ARCSIN = native_sym(Native.arcsin);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(SIN, ARCSIN);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const x = innerExpr.argList.head;
        return [TFLAG_DIFF, x];
    }
}

export const sin_arcsin = mkbuilder(Op);
