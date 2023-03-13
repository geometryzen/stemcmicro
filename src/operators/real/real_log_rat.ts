import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Err } from "../../tree/err/Err";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { UCons } from "../helpers/UCons";
import { CompositeOperator } from "../CompositeOperator";
import { is_rat } from "../rat/is_rat";

const real = native_sym(Native.real);
const log = native_sym(Native.log);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(real, log, $);
    }
    isKind(expr: U): expr is UCons<Sym, Cons> {
        if (super.isKind(expr)) {
            const logExpr = expr.argList.head;
            const x = logExpr.argList.head;
            return is_rat(x);
        }
        else {
            return false;
        }
    }
    transform1(opr: Sym, logExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const x = logExpr.argList.head;
        if (is_rat(x)) {
            if (x.isZero()) {
                // Minus infinity in the limit but undefined at zero.
                return [TFLAG_DIFF, new Err(logExpr)];
            }
            else if (x.isNegative()) {
                // Complex
                throw new Error($.toInfixString(x));
            }
            else {
                // We get to remove the real() wrapper.
                return [TFLAG_DIFF, logExpr];
            }
        }
        else {
            throw new Error($.toInfixString(x));
        }
    }
}

export const real_log_rat = new Builder();
