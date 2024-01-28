import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { is_square_root_of_real_squared } from "../../helpers/is_square_root_of_real_squared";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { Cons1 } from "../helpers/Cons1";

const POW = native_sym(Native.pow);
const RE = native_sym(Native.re);

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
        super(RE, POW, $);
    }
    isKind(expr: U): expr is Cons1<Sym, Cons> {
        const $ = this.$;
        if (super.isKind(expr)) {
            const innerExpr = expr.argList.head;
            return is_square_root_of_real_squared(innerExpr, $);
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        return [TFLAG_DIFF, innerExpr];
    }
}

export const real_pow_pow_real_two_half = new Builder();
