import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { create_boo } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { is_rat } from "../rat/is_rat";
import { CompositeOperator } from "../CompositeOperator";

const POW = native_sym(Native.pow);
const IS_REAL = native_sym(Native.isreal);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * isreal(1/z) <=> isreal(z)
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(IS_REAL, POW, $);
    }
    isKind(expr: U): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr)) {
            const pow = expr.argList.head;
            const expo = pow.expo;
            return is_rat(expo) && expo.isMinusOne();
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, pow: Cons, expr: Cons1<Sym, Cons>): [TFLAGS, U] {
        const $ = this.$;
        const z = pow.lhs;
        return [TFLAG_DIFF, create_boo($.isreal(z))];
    }
}

export const is_real_pow_any_negone = new Builder();
