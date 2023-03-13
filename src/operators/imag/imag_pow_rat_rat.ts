import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { assert_rat } from "../../tree/rat/assert_rat";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { UCons } from "../helpers/UCons";
import { is_rat } from "../rat/is_rat";

const PI = native_sym(Native.PI);
const POW = native_sym(Native.pow);
const IMAG = native_sym(Native.imag);

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
        super(IMAG, POW, $);
    }
    isKind(expr: U): expr is UCons<Sym, Cons> {
        if (super.isKind(expr)) {
            const innerExpr = expr.argList.head;
            const base = innerExpr.lhs;
            const expo = innerExpr.rhs;
            return is_rat(base) && is_rat(expo);
        }
        else {
            return false;
        }
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        // TODO: What do we do about roots of unity?
        const base = assert_rat(innerExpr.lhs);
        // console.lg("base",$.toInfixString(base));
        if (base.isMinusOne()) {
            // We have a clock form z = (-1)^s.
            // x+iy = (-1)^s
            // log(x+iy) = s*log(-1) = s*i*pi
            // x+iy = exp(i*s*pi) = cos(s*pi)+i*sin(s*pi) 
            const s = assert_rat(innerExpr.rhs);
            return [TFLAG_DIFF, $.sin($.multiply(s, PI))];
        }
        else if (base.isPositive()) {
            return [TFLAG_DIFF, zero];
        }
        else {
            // const expo = assert_rat(innerExpr.rhs);
            return [TFLAG_DIFF, outerExpr];
        }
    }
}

export const imag_pow_rat_rat = new Builder();
