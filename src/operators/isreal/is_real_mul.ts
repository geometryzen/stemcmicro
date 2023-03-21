import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { ISREAL } from "../../runtime/constants";
import { MATH_MUL } from "../../runtime/ns_math";
import { booF, booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealMul(MATH_MUL, $);
    }
}

class IsRealMul extends CompositeOperator {
    constructor(innerOpr: Sym, $: ExtensionEnv) {
        super(ISREAL, innerOpr, $);
    }
    transform1(opr: Sym, add: Cons): [TFLAGS, U] {
        const $ = this.$;
        if ([...add.argList].every(function (arg) {
            return $.isreal(arg);
        })) {
            return [TFLAG_DIFF, booT];
        }
        else {
            return [TFLAG_DIFF, booF];
        }
    }
}

export const is_real_mul = new Builder();
