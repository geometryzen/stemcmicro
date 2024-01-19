import { assert_rat, is_rat } from "math-expression-atoms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF, booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { UCons } from "../helpers/UCons";

const Pi = native_sym(Native.mathematical_constant_Pi);
const POW = native_sym(Native.pow);
const IS_REAL = native_sym(Native.isreal);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * 
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(IS_REAL, POW, $);
    }
    isKind(expr: U): expr is UCons<Sym, Cons> {
        if (super.isKind(expr)) {
            const pow = expr.argList.head;
            const base = pow.lhs;
            const expo = pow.rhs;
            return is_rat(base) && is_rat(expo);
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: UCons<Sym, Cons>): [TFLAGS, U] {
        const $ = this.$;
        const base = assert_rat(innerExpr.lhs);
        // console.lg("base",$.toInfixString(base));
        if (base.isMinusOne()) {
            // We have a clock form z = (-1)^expo.
            // x+iy = (-1)^expo
            // log(x+iy) = expo*log(-1) = expo*i*pi
            // x+iy = exp(i*expo*pi) = cos(expo*pi)+i*sin(expo*pi) 
            const expo = assert_rat(innerExpr.rhs);
            const imag = $.sin($.multiply(expo, Pi));
            if ($.iszero(imag)) {
                return [TFLAG_DIFF, booT];
            }
            else {
                return [TFLAG_DIFF, booF];
            }
        }
        else if (base.isPositive()) {
            return [TFLAG_DIFF, booT];
        }
        else {
            return [TFLAG_DIFF, booF];
        }
    }
}

export const is_real_pow_rat_rat = new Builder();
