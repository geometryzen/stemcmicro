import { count_imu_factors } from "../../calculators/count_imu_factors";
import { remove_imu_factors } from "../../calculators/remove_imu_factors";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_multiply } from "../../runtime/helpers";
import { one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { is_imu } from "../imu/is_imu";

const EXP = native_sym(Native.exp);
const REAL = native_sym(Native.real);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * 
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(REAL, EXP, $);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const z = innerExpr.argList.head;
        if ($.isreal(z)) {
            return [TFLAG_DIFF, innerExpr];
        }
        else if (is_imu(z)) {
            return [TFLAG_NONE, $.cos(one)];
        }
        else {
            if (is_multiply(z) && count_imu_factors(z) === 1) {
                const x = remove_imu_factors(z);
                if ($.isreal(x)) {
                    return [TFLAG_NONE, $.cos(x)];
                }
                else {
                    return [TFLAG_NONE, outerExpr];
                }
            }
            else {
                return [TFLAG_NONE, outerExpr];
            }
        }
    }
}

export const real_exp = new Builder();
