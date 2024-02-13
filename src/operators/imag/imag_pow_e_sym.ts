import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_base_of_natural_logarithm } from "../../predicates/is_base_of_natural_logarithm";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { assert_sym } from "../sym/assert_sym";
import { is_sym } from "../sym/is_sym";

const POW = native_sym(Native.pow);
const IM = native_sym(Native.imag);

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
        super(IM, POW, $);
    }
    isKind(expr: U): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr)) {
            const innerExpr = expr.argList.head;
            const base = innerExpr.lhs;
            const expo = innerExpr.rhs;
            return is_base_of_natural_logarithm(base) && is_sym(expo);
        }
        else {
            return false;
        }
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const expo = assert_sym(innerExpr.rhs);
        if ($.isreal(expo)) {
            return [TFLAG_DIFF, zero];
        }
        else {
            return [TFLAG_NONE, outerExpr];
        }
    }
}

export const imag_pow_e_sym = new Builder();
