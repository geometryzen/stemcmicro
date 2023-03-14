import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const conj = native_sym(Native.conj);
const mul = native_sym(Native.multiply);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * conj(a * b * c ...) = conj(a) * conj(b) * conj(c) + ...
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(conj, mul, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, $.multiply(...innerExpr.tail().map($.conj))];
    }
}

export const conj_mul = new Builder();
