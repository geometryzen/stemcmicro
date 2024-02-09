import { Err, is_rat, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, Cons1, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { CompositeOperator } from "../CompositeOperator";

const real = native_sym(Native.re);
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
    isKind(expr: U): expr is Cons1<Sym, Cons> {
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
                // We get to remove the re() wrapper.
                return [TFLAG_DIFF, logExpr];
            }
        }
        else {
            throw new Error($.toInfixString(x));
        }
    }
}

export const real_log_rat = new Builder();
