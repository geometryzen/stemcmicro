import { Directive, ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { is_multiple_of_pi } from "../../is_multiple_of_pi";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { is_negative } from "../../predicates/is_negative";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const SIN = native_sym(Native.sin);
const ADD = native_sym(Native.add);
/**
 * Note that this function does not perform an unconditional expansion.
 * Rather, it detects terms which are multiples of pi to perform simplifications.
 */
function sine_of_angle_sum(addExpr: Cons, oldExpr: U, $: ExtensionEnv): [TFLAGS, U] {
    // console.lg("sine_of_angle_sum", $.toInfixString(addExpr));
    if ($.getDirective(Directive.expandSinSum)) {
        const a = addExpr.argList.head;
        const b = $.add(...addExpr.argList.tail());
        return [TFLAG_DIFF, $.add($.multiply($.sin(a), $.cos(b)), $.multiply($.cos(a), $.sin(b)))];
    }
    else {
        let argList = addExpr.argList;
        while (is_cons(argList)) {
            const B = argList.head;
            if (is_multiple_of_pi(B, $)) {
                const A = $.subtract(addExpr, B);
                return [TFLAG_DIFF, $.add($.multiply($.sin(A), $.cos(B)), $.multiply($.cos(A), $.sin(B)))];
            }
            argList = argList.argList;
        }
        return [TFLAG_NONE, oldExpr];
    }
}

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(SIN, ADD, $);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        // sine function is antisymmetric, sin(-x) = -sin(x)
        if (is_negative(innerExpr)) {
            return [TFLAG_DIFF, $.negate($.sin($.negate(innerExpr)))];
        }
        return sine_of_angle_sum(innerExpr, outerExpr, $);
    }
}

export const sin_add = new Builder();
