import { zero } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const SIN = native_sym(Native.sin);
const IM = native_sym(Native.imag);

/**
 * im(sin(z)) = 0 when z is real
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(IM, SIN);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const z = innerExpr.argList.head;
        if ($.isreal(z)) {
            return [TFLAG_DIFF, zero];
        } else {
            return [TFLAG_NONE, outerExpr];
        }
    }
}

export const imag_sin = mkbuilder(Op);
