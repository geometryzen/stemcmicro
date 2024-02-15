import { assert_rat, booF, booT, is_rat, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, Cons1, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { CompositeOperator } from "../helpers/CompositeOperator";

const PI = native_sym(Native.PI);
const POW = native_sym(Native.pow);
const IS_REAL = native_sym(Native.isreal);

/**
 * 
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(IS_REAL, POW);
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr, $)) {
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
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons1<Sym, Cons>, $: ExtensionEnv): [TFLAGS, U] {
        const base = assert_rat(innerExpr.lhs);
        // console.lg("base",$.toInfixString(base));
        if (base.isMinusOne()) {
            // We have a clock form z = (-1)^expo.
            // x+iy = (-1)^expo
            // log(x+iy) = expo*log(-1) = expo*i*pi
            // x+iy = exp(i*expo*pi) = cos(expo*pi)+i*sin(expo*pi) 
            const expo = assert_rat(innerExpr.rhs);
            const imag = $.sin($.multiply(expo, PI));
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

export const is_real_pow_rat_rat = mkbuilder(Op);
