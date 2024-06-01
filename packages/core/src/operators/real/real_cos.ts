import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const COS = native_sym(Native.cos);
const RE = native_sym(Native.real);

/**
 * re(cos(z)) = cos(z) when z is real
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RE, COS);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const z = innerExpr.argList.head;
        if ($.isreal(z)) {
            return [TFLAG_DIFF, innerExpr];
        } else {
            return [TFLAG_NONE, outerExpr];
        }
    }
}

export const real_cos = mkbuilder(Op);
