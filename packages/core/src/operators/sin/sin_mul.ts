import { Directive } from "@stemcmicro/directive";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_negative } from "../../predicates/is_negative";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { sin_special_angles } from "./transform_sin";

const SIN = native_sym(Native.sin);
const MUL = native_sym(Native.multiply);

/**
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(SIN, MUL);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        if ($.getDirective(Directive.convertTrigToExp)) {
            const pos_ix = $.multiply(imu, innerExpr);
            const neg_ix = $.negate(pos_ix);
            return [TFLAG_DIFF, $.divide($.multiply(imu, $.subtract($.exp(neg_ix), $.exp(pos_ix))), two)];
        } else {
            // sine function is antisymmetric, sin(-x) = -sin(x)
            if (is_negative(innerExpr)) {
                return [TFLAG_DIFF, $.negate($.sin($.negate(innerExpr)))];
            }
            return sin_special_angles(innerExpr, outerExpr, $);
        }
    }
}

export const sin_mul = mkbuilder(Op);
