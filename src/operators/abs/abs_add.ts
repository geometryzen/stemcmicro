import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const ABS = native_sym(Native.abs);
const ADD = native_sym(Native.add);
const MUL = native_sym(Native.multiply);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * abs(a + b + ...)
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(ABS, ADD, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(this.name, $.toInfixString(innerExpr));
        return [TFLAG_NONE, outerExpr];
    }
}

export const abs_add = new Builder();

