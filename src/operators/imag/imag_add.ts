import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const ADD = native_sym(Native.add);
const IM = native_sym(Native.imag);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * im(a + b + ...) = im(a) + im(b) + ...
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(IM, ADD, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, addExpr: Cons, imExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(this.name, $.toInfixString(addExpr));
        const argList = addExpr.argList;
        const retval = $.add(...argList.map($.im));
        // console.lg(this.name, $.toInfixString(addExpr),"retval", $.toInfixString(retval));
        return [TFLAG_NONE, retval];
    }
}

export const imag_add = new Builder();
