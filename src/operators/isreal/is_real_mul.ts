import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { PREDICATE_IS_REAL } from "../../runtime/constants";
import { MATH_MUL } from "../../runtime/ns_math";
import { booF, booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { AbstractChain } from "./AbstractChain";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealMul(MATH_MUL, $);
    }
}

class IsRealMul extends AbstractChain {
    constructor(innerOpr: Sym, $: ExtensionEnv) {
        super(PREDICATE_IS_REAL, innerOpr, $);
    }
    transform1(opr: Sym, add: Cons): [TFLAGS, U] {
        const $ = this.$;
        if ([...add.argList].every(function (arg) {
            return $.is_real(arg);
        })) {
            return [TFLAG_DIFF, booT];
        }
        else {
            return [TFLAG_DIFF, booF];
        }
    }
}

export const is_real_mul = new Builder();
