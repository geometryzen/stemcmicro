import { one } from "@stemcmicro/atoms";
import { count_imu_factors } from "../../calculators/count_imu_factors";
import { remove_imu_factors } from "../../calculators/remove_imu_factors";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_multiply } from "../../runtime/helpers";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const ABS = native_sym(Native.abs);
const EXP = native_sym(Native.exp);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ABS, EXP);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, expExpr: Cons, absExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(expExpr));
        const z = expExpr.argList.head;
        if (is_multiply(z)) {
            if (count_imu_factors(z) === 1) {
                const remaining = remove_imu_factors(z);
                if ($.isreal(remaining)) {
                    return [TFLAG_DIFF, one];
                }
            }
        }
        if ($.isreal(z)) {
            return [TFLAG_DIFF, expExpr];
        }
        return [TFLAG_NONE, absExpr];
    }
}

export const abs_exp = mkbuilder(Op);
