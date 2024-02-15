import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const SIN = native_sym(Native.sin);
const RECT = native_sym(Native.rect);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RECT, SIN);
    }
    transform1(opr: Sym, sinExpr: Cons, rectExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const sinArg = sinExpr.arg;
        if ($.isreal(sinArg)) {
            return [TFLAG_DIFF, sinExpr];
        }
        return [TFLAG_NONE, rectExpr];
    }
}

export const rect_sin = mkbuilder(Op);

