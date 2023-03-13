import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const EXP = native_sym(Native.exp);
const REAL = native_sym(Native.real);

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
        super(REAL, EXP, $);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const z = innerExpr.argList.head;
        if ($.is_real(z)) {
            return [TFLAG_DIFF, innerExpr];
        }
        else {
            return [TFLAG_NONE, outerExpr];
        }
    }
}

export const real_exp = new Builder();
