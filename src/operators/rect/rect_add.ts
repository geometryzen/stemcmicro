import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const ADD = native_sym(Native.add);
const RECT = native_sym(Native.rect);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * rect(a + b + ...) = rect(a) + rect(b) + ...
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(RECT, ADD, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(this.name, $.toInfixString(innerExpr));
        return [TFLAG_DIFF, $.add(...innerExpr.argList.map($.rect))];
    }
}

export const rect_add = new Builder();

