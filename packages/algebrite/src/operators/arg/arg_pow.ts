import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { compute_theta_from_base_and_expo } from "../real/compute_theta_from_base_and_expo";

const ARG = native_sym(Native.arg);
const POW = native_sym(Native.pow);

/**
 *
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ARG, POW);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const base = innerExpr.lhs;
        const expo = innerExpr.rhs;
        const theta = compute_theta_from_base_and_expo(base, expo, $);
        return [TFLAG_DIFF, theta];
    }
}

export const arg_pow = mkbuilder(Op);
