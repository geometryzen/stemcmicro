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

const ABS = native_sym(Native.abs);
const EXP = native_sym(Native.exp);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(ABS, EXP, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(this.name, this.$.toInfixString(innerExpr));
        const z = innerExpr.argList.head;
        if (is_multiply(z)) {
            if (count_imu_factors(z) === 1) {
                const remaining = remove_imu_factors(z);
                if ($.is_real(remaining)) {
                    return [TFLAG_DIFF, one];
                }
            }
        }
        if ($.is_real(z)) {
            return [TFLAG_DIFF, innerExpr];
        }
        return [TFLAG_NONE, outerExpr];
    }
}

export const abs_exp = new Builder();
