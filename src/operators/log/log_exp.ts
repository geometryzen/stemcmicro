import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const LOG = native_sym(Native.log);
const EXP = native_sym(Native.exp);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(LOG, EXP, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(innerExpr));
        const x = innerExpr.argList.head;
        return [TFLAG_DIFF, x];
    }
}

export const log_exp = new Builder();
