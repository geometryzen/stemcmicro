import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionBuilder, ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const RE = native_sym(Native.real);

class Builder implements ExtensionBuilder<U> {
    constructor(readonly innerOpr: Sym) {
        // 
    }
    create(config: Readonly<EnvConfig>): Extension<U> {
        return new Op(this.innerOpr, config);
    }
}

class Op extends CompositeOperator {
    constructor(innerOpr: Sym, readonly config: Readonly<EnvConfig>) {
        super(RE, innerOpr);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
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
 * re(f(z)) = f(z) when z is real
 */
export function real_holomorphic(innerOpr: Sym): ExtensionBuilder<U> {
    return new Builder(innerOpr);
}
