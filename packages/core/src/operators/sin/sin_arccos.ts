import { half, one, two } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const SIN = native_sym(Native.sin);
const ARCCOS = native_sym(Native.arccos);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(SIN, ARCCOS);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const x = innerExpr.argList.head;
        const x_squared = $.power(x, two);
        const one_minus_x_squared = $.subtract(one, x_squared);
        const retval = $.power(one_minus_x_squared, half);
        return [TFLAG_DIFF, retval];
    }
}

export const sin_arccos = mkbuilder(Op);
