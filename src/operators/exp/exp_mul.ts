import { count_imu_factors } from "../../calculators/count_imu_factors";
import { remove_imu_factors } from "../../calculators/remove_imu_factors";
import { Directive, ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { imu } from "../../tree/imu/Imu";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const EXP = native_sym(Native.exp);
const MUL = native_sym(Native.multiply);
const PI = native_sym(Native.PI);

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
        super(EXP, MUL, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(innerExpr));
        // console.lg("clock?", this.$.getDirective(Directive.complexAsClock));
        // console.lg("polar?", this.$.getDirective(Directive.complexAsPolar));
        const $ = this.$;
        if ($.getDirective(Directive.convertExpToTrig)) {
            if (count_imu_factors(innerExpr) === 1) {
                const x = remove_imu_factors(innerExpr);
                const c = $.cos(x);
                const s = $.sin(x);
                return [TFLAG_DIFF, $.add(c, $.multiply(imu, s))];
            }
        }
        if (!$.getDirective(Directive.complexAsPolar)) {
            if ((count_imu_factors(innerExpr) === 1) && innerExpr.contains(PI)) {
                const x = remove_imu_factors(innerExpr);
                const c = $.cos(x);
                const s = $.sin(x);
                return [TFLAG_DIFF, $.add(c, $.multiply(imu, s))];
            }
        }
        return [TFLAG_NONE, outerExpr];
    }
}

export const exp_mul = new Builder();

