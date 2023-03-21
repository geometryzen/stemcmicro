import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF, booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const ADD = native_sym(Native.add);
const IS_REAL = native_sym(Native.isreal);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealAdd($);
    }
}

class IsRealAdd extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(IS_REAL, ADD, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export const is_real_add = new Builder();
