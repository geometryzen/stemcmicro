import { create_boo, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, U } from "math-expression-tree";
import { Extension, ExtensionBuilder, ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { CompositeOperator } from "../helpers/CompositeOperator";

const is_real = native_sym(Native.isreal);
const cosine = native_sym(Native.cos);

class Builder implements ExtensionBuilder<U> {
    constructor(readonly innerOpr: Sym) {}
    create(): Extension<U> {
        return new Op(this.innerOpr);
    }
}

class Op extends CompositeOperator {
    constructor(innerOpr: Sym) {
        super(is_real, innerOpr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const x = innerExpr.argList.head;
        return [TFLAG_DIFF, create_boo($.isreal(x))];
    }
}

export function isreal_holomorphic(innerOpr: Sym) {
    return new Builder(innerOpr);
}

export const is_real_cos = isreal_holomorphic(cosine);
