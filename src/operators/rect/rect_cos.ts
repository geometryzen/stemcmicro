import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const COS = native_sym(Native.cos);
const RECT = native_sym(Native.rect);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(RECT, COS, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, cosExpr: Cons, rectExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const cosArg = cosExpr.arg;
        if ($.isreal(cosArg)) {
            return [TFLAG_DIFF, cosExpr];
        }
        return [TFLAG_NONE, rectExpr];
    }
}

export const rect_cos = new Builder();

