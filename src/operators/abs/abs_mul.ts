import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const ABS = native_sym(Native.abs);
const MUL = native_sym(Native.multiply);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * abs(a * b 8 ...) = abs(a) * abs(b) * ...
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(ABS, MUL, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, mulExpr: Cons, absExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, $.multiply(...mulExpr.argList.map($.abs))];
    }
}

export const abs_mul = new Builder();

