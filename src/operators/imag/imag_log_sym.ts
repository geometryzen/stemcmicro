import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Err } from "../../tree/err/Err";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { assert_sym } from "../sym/assert_sym";
import { is_sym } from "../sym/is_sym";

const imag = native_sym(Native.im);
const log = native_sym(Native.log);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(imag, log, $);
    }
    isKind(expr: U): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr)) {
            const innerExpr = expr.argList.head;
            const x = innerExpr.argList.head;
            return is_sym(x);
        }
        else {
            return false;
        }
    }
    transform1(opr: Sym, innerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const x = assert_sym(innerExpr.argList.head);
        const props = $.getSymbolPredicates(x);
        if (props.zero) {
            // Minus infinity in the limit but undefined at zero.
            return [TFLAG_DIFF, new Err(innerExpr)];
        }
        else if (props.negative) {
            // Complex
            throw new Error($.toInfixString(x));
        }
        else {
            return [TFLAG_DIFF, zero];
        }
    }
}

export const imag_log_sym = new Builder();
