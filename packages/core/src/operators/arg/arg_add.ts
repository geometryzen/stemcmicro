import { half, Sym } from "@stemcmicro/atoms";
import { is_negative } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, items_to_cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hook_create_err } from "../../hooks/hook_create_err";
import { DynamicConstants } from "../../runtime/defs";
import { CompositeOperator } from "../helpers/CompositeOperator";

const ARG = native_sym(Native.arg);
const ADD = native_sym(Native.add);

function arg_of_sum(z: Cons, $: ExtensionEnv): U {
    const y = $.im(z);
    const x = $.re(z);
    if ($.iszero(x)) {
        if ($.iszero(y)) {
            return hook_create_err(items_to_cons(ARG, $.add(x, y)));
        } else {
            const k = is_negative(y) ? half.neg() : half;
            const pi = DynamicConstants.PI($);
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
    } else {
        if (is_negative(x)) {
            const pi = DynamicConstants.PI($);
            if (is_negative(y)) {
                return $.subtract($.arctan($.divide(y, x)), pi);
            } else {
                const lhs = $.arctan($.divide(y, x));
                const rhs = pi;
                const sum = $.add(lhs, rhs);
                return sum;
            }
        } else {
            // TODO: We're getting arg(x) is zero because of assumptions that x is not negative.
            return $.arctan($.divide(y, x));
        }
    }
}

/**
 * arg(a + b + c ...)
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ARG, ADD);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, arg_of_sum(innerExpr, $)];
    }
}

export const arg_add = mkbuilder(Op);
