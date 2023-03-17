import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { count_imu_factors } from "../../calculators/count_imu_factors";
import { remove_factors } from "../../calculators/remove_factors";
import { remove_imu_factors } from "../../calculators/remove_imu_factors";
import { Directive, ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { imu } from "../../tree/imu/Imu";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_blade } from "../blade/is_blade";
import { CompositeOperator } from "../CompositeOperator";
import { is_rat } from "../rat/is_rat";

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
            // A generalization is that we can count factors whose square is -1.
            if (contains_single_blade(innerExpr)) {
                const B = extract_single_blade(innerExpr);
                const BxB = $.multiply(B, B);
                if (is_rat(BxB) && BxB.isMinusOne()) {
                    const x = remove_factors(innerExpr, is_blade);
                    const c = $.cos(x);
                    const s = $.sin(x);
                    return [TFLAG_DIFF, $.add(c, $.multiply(B, s))];
                }
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

