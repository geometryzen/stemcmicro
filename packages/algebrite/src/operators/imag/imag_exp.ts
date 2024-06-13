import { one, zero } from "@stemcmicro/atoms";
import { count_imu_factors } from "../../calculators/count_imu_factors";
import { remove_imu_factors } from "../../calculators/remove_imu_factors";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { is_multiply } from "../../runtime/helpers";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { is_imu } from "../imu/is_imu";

const EXP = native_sym(Native.exp);
const IM = native_sym(Native.imag);

/**
 * im(exp(z)) = 0 when z is real
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(IM, EXP);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name);
        const z = innerExpr.argList.head;
        if ($.isreal(z)) {
            return [TFLAG_DIFF, zero];
        } else if (is_imu(z)) {
            return [TFLAG_NONE, $.sin(one)];
        } else {
            if (is_multiply(z) && count_imu_factors(z) === 1) {
                const x = remove_imu_factors(z);
                if ($.isreal(x)) {
                    return [TFLAG_NONE, $.sin(x)];
                } else {
                    return [TFLAG_NONE, outerExpr];
                }
            } else {
                return [TFLAG_NONE, outerExpr];
            }
        }
    }
}

export const imag_exp = mkbuilder(Op);
