import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { ISREAL } from "../../runtime/constants";
import { create_boo } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

export const MATH_SIN = native_sym(Native.sin);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealSin($);
    }
}

/**
 * isreal(sin(z)) => isreal(z)
 */
class IsRealSin extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(ISREAL, MATH_SIN, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, sinExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const x = sinExpr.argList.head;
        return [TFLAG_DIFF, create_boo($.isreal(x))];
    }
}

export const is_real_sin = new Builder();
