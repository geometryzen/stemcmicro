import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { is_rat } from "../rat/is_rat";

const rect = native_sym(Native.rect);
const pow = native_sym(Native.pow);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * rect(1/(x+i*y)) => (x-i*y)/(x**2+y**2)
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(rect, pow, $);
    }
    isKind(expr: U): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr)) {
            const powExpr = expr.argList.head;
            const base = powExpr.base;
            const expo = powExpr.expo;
            if (is_rat(expo) && expo.isMinusOne()) {
                const $ = this.$;
                if ($.isreal(base)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, powExpr: Cons, rectExpr: Cons1<Sym, Cons>): [TFLAGS, U] {
        const $ = this.$;
        const z = powExpr.base;
        const conj_z = $.conj(z);
        return [TFLAG_NONE, $.divide(conj_z, $.multiply(conj_z, z))];
    }
}

export const rect_pow_complex_negone = new Builder();
