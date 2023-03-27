import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { assert_rat } from "../../tree/rat/assert_rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { UCons } from "../helpers/UCons";
import { is_rat } from "../rat/is_rat";

const rect = native_sym(Native.rect);
const pow = native_sym(Native.pow);

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
        super(rect, pow, $);
    }
    isKind(expr: U): expr is UCons<Sym, Cons> {
        if (super.isKind(expr)) {
            const powExpr = expr.argList.head;
            const base = powExpr.base;
            const expo = powExpr.expo;
            return is_rat(base) && is_rat(expo);
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, powExpr: Cons, rectExpr: UCons<Sym, Cons>): [TFLAGS, U] {
        const base = assert_rat(powExpr.base);
        // const expo = assert_rat(powExpr.expo);
        if (base.isPositive()) {
            return [TFLAG_DIFF, powExpr];
        }
        return [TFLAG_DIFF, rectExpr];
    }
}

export const rect_pow_rat_rat = new Builder();
