import { count_factors } from "../../calculators/count_factors";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_base_of_natural_logarithm } from "../../predicates/is_base_of_natural_logarithm";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { UCons } from "../helpers/UCons";
import { is_imu } from "../imu/is_imu";
import { CompositeOperator } from "../CompositeOperator";

const rect = native_sym(Native.rect);
const pow = native_sym(Native.pow);

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
        super(rect, pow, $);
    }
    isKind(expr: U): expr is UCons<Sym, Cons> {
        if (super.isKind(expr)) {
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
                }
                else {
                    return false;
                }
            }
            else {
                // console.lg("base is not e", this.$.toSExprString(base));
                return false;
            }
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, expr: UCons<Sym, Cons>): [TFLAGS, U] {
        return [TFLAG_DIFF, expr];
    }
}

export const rect_pow_exp_imu = new Builder();
