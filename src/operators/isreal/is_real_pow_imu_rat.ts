import { assert_rat, is_rat } from "math-expression-atoms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF, booT } from "../../tree/boo/Boo";
import { four } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { is_imu } from "../imu/is_imu";

const POW = native_sym(Native.pow);
const IS_REAL = native_sym(Native.isreal);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealPow($);
    }
}

/**
 * isreal(z) <=> iszero(im(z))
 */
class IsRealPow extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(IS_REAL, POW, $);
    }
    isKind(expr: U): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr)) {
            // console.lg("expr", expr.toString());
            const pow = expr.argList.head;
            // console.lg("pow", pow.toString());
            const base = pow.lhs;
            const expo = pow.rhs;
            return is_imu(base) && is_rat(expo);
            // return true;
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, pow: Cons, expr: Cons1<Sym, Cons>): [TFLAGS, U] {
        const expo = assert_rat(pow.rhs);
        const numer = expo.numer();
        const denom = expo.denom();
        // If the denominator is 1 then we avoid the issues of roots of unity.
        if (denom.isOne()) {
            // If the numerator is divisible by 4 then the argument evaluates to 1.
            // In that case, the imaginary part will be zero.
            if (numer.div(four).isInteger()) {
                return [TFLAG_DIFF, booT];
            }
            else {
                return [TFLAG_DIFF, booF];
            }
        }
        else {
            return [TFLAG_DIFF, booF];
        }
    }
}

export const is_real_pow_imu_rat = new Builder();
