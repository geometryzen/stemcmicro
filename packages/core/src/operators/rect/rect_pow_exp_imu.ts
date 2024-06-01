import { count_factors } from "../../calculators/count_factors";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_base_of_natural_logarithm } from "../../predicates/is_base_of_natural_logarithm";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { is_imu } from "../imu/is_imu";

const rect = native_sym(Native.rect);
const pow = native_sym(Native.pow);

/**
 *
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(rect, pow);
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr, $)) {
            const powExpr = expr.argList.head;
            // console.lg("powExpr", this.$.toSExprString(powExpr));
            const base = powExpr.lhs;
            // console.lg("base", this.$.toSExprString(base));
            const expo = powExpr.rhs;
            // console.lg("expo", this.$.toSExprString(expo));
            if (is_base_of_natural_logarithm(base)) {
                // console.lg("is_base OK");
                if (is_cons(expo) && count_factors(expo, is_imu) == 1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                // console.lg("base is not e", this.$.toSExprString(base));
                return false;
            }
        } else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, expr: Cons1<Sym, Cons>): [TFLAGS, U] {
        // console.lg(this.name);
        return [TFLAG_DIFF, expr];
    }
}

export const rect_pow_exp_imu = mkbuilder(Op);
