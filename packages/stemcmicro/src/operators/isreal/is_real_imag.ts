import { booT, Sym } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { IMAG, ISREAL } from "../../runtime/constants";
import { CompositeOperator } from "../helpers/CompositeOperator";

/**
 * isreal(im(z)) is always true because im(z) always return a real number.
 */
class IsRealImag extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ISREAL, IMAG);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, add: Cons): [TFLAGS, U] {
        return [TFLAG_DIFF, booT];
    }
}

export const is_real_imag = mkbuilder(IsRealImag);
