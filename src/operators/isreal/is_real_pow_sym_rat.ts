import { assert_rat, is_rat } from "math-expression-atoms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF, booT, create_boo } from "../../tree/boo/Boo";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { assert_sym } from "../sym/assert_sym";
import { is_sym } from "../sym/is_sym";

const POW = native_sym(Native.pow);
const IS_REAL = native_sym(Native.isreal);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * isreal(z) <=> iszero(im(z))
 */
class Op extends CompositeOperator {
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
            return is_sym(base) && is_rat(expo);
            // return true;
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, pow: Cons, expr: Cons1<Sym, Cons>): [TFLAGS, U] {
        const $ = this.$;
        const base = assert_sym(pow.lhs);
        const expo = assert_rat(pow.rhs);
        const numer = expo.numer();
        const denom = expo.denom();
        if ($.isreal(base)) {
            if (numer.div(two).isInteger()) {
                if (denom.isOne()) {
                    return [TFLAG_DIFF, booT];
                }
                else {
                    return [TFLAG_DIFF, booF];
                }
            }
            else if (numer.isMinusOne()) {
                if (denom.isOne()) {
                    // Duplicates rule in is_real_pow_ant_negone.
                    return [TFLAG_DIFF, create_boo($.isreal(base))];
                }
                else {
                    return [TFLAG_DIFF, booF];
                }
            }
            else {
                return [TFLAG_DIFF, booF];
            }
        }
        else {
            return [TFLAG_DIFF, booF];
        }
        // const denom = expo.denom();
        // We can improve on this...
    }
}

export const is_real_pow_sym_rat = new Builder();
