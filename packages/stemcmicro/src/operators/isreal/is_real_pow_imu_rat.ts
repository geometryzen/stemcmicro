import { assert_rat, booF, booT, is_imu, is_rat, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, Cons1, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { four } from "../../tree/rat/Rat";
import { CompositeOperator } from "../helpers/CompositeOperator";

const POW = native_sym(Native.pow);
const IS_REAL = native_sym(Native.isreal);

/**
 * isreal(z) <=> iszero(im(z))
 */
class IsRealPow extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(IS_REAL, POW);
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr, $)) {
            // console.lg("expr", expr.toString());
            const pow = expr.argList.head;
            // console.lg("pow", pow.toString());
            const base = pow.lhs;
            const expo = pow.rhs;
            return is_imu(base) && is_rat(expo);
            // return true;
        } else {
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
            } else {
                return [TFLAG_DIFF, booF];
            }
        } else {
            return [TFLAG_DIFF, booF];
        }
    }
}

export const is_real_pow_imu_rat = mkbuilder(IsRealPow);
