import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_negative } from "../../predicates/is_negative";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { sin_special_angles } from "./transform_sin";

const SIN = native_sym(Native.sin);
const MUL = native_sym(Native.multiply);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(SIN, MUL, $);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        // sine function is antisymmetric, sin(-x) = -sin(x)
        if (is_negative(innerExpr)) {
            return [TFLAG_DIFF, $.negate($.sin($.negate(innerExpr)))];
        }
        return sin_special_angles(innerExpr, outerExpr, $);
    }
}

export const sin_mul = new Builder();
