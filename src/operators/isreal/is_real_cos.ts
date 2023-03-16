import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { create_boo } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const is_real = native_sym(Native.is_real);
const cosine = native_sym(Native.cos);

class Builder implements OperatorBuilder<U> {
    constructor(readonly innerOpr: Sym) {

    }
    create($: ExtensionEnv): Operator<U> {
        return new Op(this.innerOpr, $);
    }
}

class Op extends CompositeOperator {
    constructor(innerOpr: Sym, $: ExtensionEnv) {
        super(is_real, innerOpr, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const x = innerExpr.argList.head;
        return [TFLAG_DIFF, create_boo($.is_real(x))];
    }
}

export function isreal_holomorphic(innerOpr: Sym) {
    return new Builder(innerOpr);
}

export const is_real_cos = isreal_holomorphic(cosine);
