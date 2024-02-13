import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { cons, Cons, items_to_cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const ADD = native_sym(Native.add);
const RE = native_sym(Native.real);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * re(a + b + ...) = re(a) + re(b) + ...
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(RE, ADD, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const argList = innerExpr.argList;
        const A = argList.map(function (arg) {
            return $.valueOf(items_to_cons(RE, arg));
        });
        const sum = $.valueOf(cons(ADD, A));
        return [TFLAG_NONE, sum];
    }
}

export const real_add = new Builder();
