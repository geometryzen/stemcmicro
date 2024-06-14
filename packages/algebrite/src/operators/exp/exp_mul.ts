import { is_blade } from "@stemcmicro/atoms";
import { Directive } from "@stemcmicro/directive";
import { contains_single_blade, extract_single_blade, remove_factors } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { count_imu_factors } from "../../calculators/count_imu_factors";
import { remove_imu_factors } from "../../calculators/remove_imu_factors";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { imu } from "../../tree/imu/Imu";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { is_rat } from "../rat/is_rat";

const EXP = native_sym(Native.exp);
const MUL = native_sym(Native.multiply);
// const PI = native_sym(Native.PI);

/**
 *
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(EXP, MUL);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(innerExpr));
        // console.lg("converExpToTrig?", this.$.getDirective(Directive.convertExpToTrig));
        // console.lg("converTrigToExp?", this.$.getDirective(Directive.convertTrigToExp));
        // console.lg("clock?", this.$.getDirective(Directive.complexAsClock));
        // console.lg("polar?", this.$.getDirective(Directive.complexAsPolar));
        if (should_convert_exp_to_trig($)) {
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
        return [TFLAG_NONE, outerExpr];
    }
}

function should_convert_exp_to_trig($: ExtensionEnv): boolean {
    if ($.getDirective(Directive.convertExpToTrig)) {
        return true;
    }
    if ($.getDirective(Directive.complexAsClock)) {
        return false;
    }
    if ($.getDirective(Directive.complexAsPolar)) {
        return false;
    }
    if ($.getDirective(Directive.convertTrigToExp)) {
        return false;
    }
    if ($.getDirective(Directive.complexAsRectangular)) {
        return true;
    }
    return true;
}

export const exp_mul = mkbuilder(Op);
