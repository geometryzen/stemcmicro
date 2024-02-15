import { count_imu_factors } from "../../calculators/count_imu_factors";
import { remove_imu_factors } from "../../calculators/remove_imu_factors";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_multiply } from "../../runtime/helpers";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const ARG = native_sym(Native.arg);
const EXP = native_sym(Native.exp);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * arg(exp(expr))
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(ARG, EXP, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, expExpr: Cons, argExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(this.name, this.$.toInfixString(innerExpr));
        const expr = expExpr.argList.head;
        if (is_multiply(expr) && count_imu_factors(expr) === 1) {
            const x = remove_imu_factors(expr);
            return [TFLAG_DIFF, x];
        }
        if ($.isreal(expr)) {
            return [TFLAG_NONE, zero];
        }
        return [TFLAG_NONE, argExpr];
    }
}

export const arg_exp = new Builder();
