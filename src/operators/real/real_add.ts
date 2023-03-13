import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { cons, Cons, items_to_cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const ADD = native_sym(Native.add);
const REAL = native_sym(Native.real);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * real(a + b + ...) = real(a) + real(b) + ...
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(REAL, ADD, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const argList = innerExpr.argList;
        const A = argList.map(function (arg) {
            return $.valueOf(items_to_cons(REAL, arg));
        });
        const sum = $.valueOf(cons(ADD, A));
        return [TFLAG_NONE, sum];
    }
}

export const real_add = new Builder();
