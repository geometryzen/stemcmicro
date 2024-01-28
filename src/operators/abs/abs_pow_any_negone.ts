import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { is_rat } from "../rat/is_rat";

const POW = native_sym(Native.pow);
const ABS = native_sym(Native.abs);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * abs(1/z) <=> 1/abs(z)
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(ABS, POW, $);
    }
    isKind(expr: U): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr)) {
            const pow = expr.argList.head;
            const expo = pow.expo;
            return is_rat(expo) && expo.isMinusOne();
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(absOpr: Sym, powExpr: Cons, expr: Cons1<Sym, Cons>): [TFLAGS, U] {
        const $ = this.$;
        const z = powExpr.lhs;
        const abs_z = $.valueOf(items_to_cons(absOpr, z));
        const one_over_abs_z = $.valueOf(items_to_cons(powExpr.opr, abs_z, negOne));
        return [TFLAG_DIFF, one_over_abs_z];
    }
}

export const abs_pow_any_negone = new Builder();
