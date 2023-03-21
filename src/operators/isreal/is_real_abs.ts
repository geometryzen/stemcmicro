import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const ABS = native_sym(Native.abs);
const ISREAL = native_sym(Native.isreal);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealAdd($);
    }
}

class IsRealAdd extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(ISREAL, ABS, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        return [TFLAG_DIFF, booT];
    }
}

export const is_real_abs = new Builder();
