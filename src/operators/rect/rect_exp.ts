import { count_imu_factors } from "../../calculators/count_imu_factors";
import { remove_imu_factors } from "../../calculators/remove_imu_factors";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_multiply } from "../../runtime/helpers";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const EXP = native_sym(Native.exp);
const RECT = native_sym(Native.rect);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RECT, EXP);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, expExpr: Cons, rectExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const arg = expExpr.arg;
        if ($.isreal(arg)) {
            return [TFLAG_DIFF, expExpr];
        }
        if (is_multiply(arg)) {
            if (count_imu_factors(arg) === 1) {
                const x = remove_imu_factors(arg);
                return [TFLAG_DIFF, $.add($.cos(x), $.multiply(imu, $.sin(x)))];
            }
        }
        return [TFLAG_NONE, rectExpr];
    }
}

export const rect_exp = mkbuilder(Op);

