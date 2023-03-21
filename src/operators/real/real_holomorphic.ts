import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const REAL = native_sym(Native.real);

class Builder implements OperatorBuilder<U> {
    constructor(readonly innerOpr: Sym) {
        // 
    }
    create($: ExtensionEnv): Operator<U> {
        return new Op(this.innerOpr, $);
    }
}

class Op extends CompositeOperator {
    constructor(innerOpr: Sym, $: ExtensionEnv) {
        super(REAL, innerOpr, $);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const z = innerExpr.argList.head;
        if ($.isreal(z)) {
            return [TFLAG_DIFF, innerExpr];
        }
        else {
            return [TFLAG_NONE, outerExpr];
        }
    }
}

/**
 * real(f(z)) = f(z) when z is real
 */
export function real_holomorphic(innerOpr: Sym): OperatorBuilder<U> {
    return new Builder(innerOpr);
}
