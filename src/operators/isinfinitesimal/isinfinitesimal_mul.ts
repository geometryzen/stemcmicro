import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF, booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const ISINIFINITESIMAL = native_sym(Native.isinfinitesimal);
const MULTIPLY = native_sym(Native.multiply);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op(MULTIPLY, $);
    }
}

class Op extends CompositeOperator {
    constructor(innerOpr: Sym, $: ExtensionEnv) {
        super(ISINIFINITESIMAL, innerOpr, $);
    }
    transform1(opr: Sym, add: Cons): [TFLAGS, U] {
        const $ = this.$;
        if ([...add.argList].some(function (arg) {
            return $.isinfinitesimal(arg);
        })) {
            return [TFLAG_DIFF, booT];
        }
        else {
            return [TFLAG_DIFF, booF];
        }
    }
}

export const isinfinitesimal_mul = new Builder();
