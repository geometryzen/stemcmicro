import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_negative } from "../../predicates/is_negative";
import { DynamicConstants } from "../../runtime/defs";
import { Err } from "../../tree/err/Err";
import { half } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";

const ARG = native_sym(Native.arg);
const ADD = native_sym(Native.add);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

function arg_of_sum(z: Cons, $: ExtensionEnv): U {
    const y = $.imag(z);
    const x = $.real(z);
    if ($.iszero(x)) {
        if ($.iszero(y)) {
            // Undefined
            return new Err(items_to_cons(ARG, $.add(x, y)));
        }
        else {
            const k = is_negative(y) ? half.neg() : half;
            const pi = DynamicConstants.Pi($);
            return $.multiply(k, pi);
        }
        /*
        else if (is_negative(y)) {
            return $.negate(pi);
        }
        else {
            return divide(pi,two,$);
        }
        */
    }
    else {
        if (is_negative(x)) {
            const pi = DynamicConstants.Pi($);
            if (is_negative(y)) {
                return $.subtract($.arctan($.divide(y, x)), pi);
            }
            else {
                const lhs = $.arctan($.divide(y, x));
                const rhs = pi;
                const sum = $.add(lhs, rhs);
                return sum;
            }
        }
        else {
            // TODO: We're getting arg(x) is zero because of assumptions that x is not negative.
            return $.arctan($.divide(y, x));
        }
    }

}

/**
 * arg(a + b + c ...)
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(ARG, ADD, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        return [TFLAG_DIFF, arg_of_sum(innerExpr, this.$)];
    }
}

export const arg_add = new Builder();
