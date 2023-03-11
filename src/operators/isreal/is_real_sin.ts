import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { PREDICATE_IS_REAL } from "../../runtime/constants";
import { create_boo } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { MATH_SIN } from "../sin/MATH_SIN";
import { AbstractChain } from "./AbstractChain";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealSin($);
    }
}

/**
 * isreal(sin(z)) => isreal(z)
 */
 class IsRealSin extends AbstractChain {
    constructor($: ExtensionEnv) {
        super(PREDICATE_IS_REAL, MATH_SIN, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, sinExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const x = sinExpr.argList.head;
        return [TFLAG_DIFF, create_boo($.is_real(x))];
    }
}

export const is_real_sin = new Builder();
