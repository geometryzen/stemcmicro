import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { create_boo } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { AbstractChain } from "./AbstractChain";

const is_real = native_sym(Native.is_real);
const cosine = native_sym(Native.cosine);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealCos($);
    }
}

class IsRealCos extends AbstractChain {
    constructor($: ExtensionEnv) {
        super(is_real, cosine, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, cosExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const x = cosExpr.argList.head;
        return [TFLAG_DIFF, create_boo($.is_real(x))];
    }
}

export const is_real_cos = new Builder();
