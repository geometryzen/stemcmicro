import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const IM = native_sym(Native.imag);
const RE = native_sym(Native.real);

/**
 * re(im(z)) = im(z)
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RE, IM);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        return [TFLAG_DIFF, innerExpr];
    }
}

export const real_imag = mkbuilder(Op);
