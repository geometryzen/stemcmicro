import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { cons, Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const ADD = native_sym(Native.add);
const LOG = native_sym(Native.log);
const MUL = native_sym(Native.multiply);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * log(a * b * ...) = log(a) + log(b) + ...
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(LOG, MUL, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(this.name, $.toInfixString(innerExpr));
        return [TFLAG_DIFF, $.valueOf(cons(ADD, innerExpr.argList.map($.log)))];
    }
}

export const log_mul = new Builder();

