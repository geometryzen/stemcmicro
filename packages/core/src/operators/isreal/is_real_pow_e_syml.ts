import { assert_sym, is_sym, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { predicate_return_value } from "../../helpers/predicate_return_value";
import { is_base_of_natural_logarithm } from "../../predicates/is_base_of_natural_logarithm";
import { CompositeOperator } from "../helpers/CompositeOperator";

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
            const innerExpr = expr.argList.head;
            const base = innerExpr.lhs;
            const expo = innerExpr.rhs;
            return is_base_of_natural_logarithm(base) && is_sym(expo);
        } else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons1<Sym, Cons>, $: ExtensionEnv): [TFLAGS, U] {
        const expo = assert_sym(innerExpr.rhs);
        if ($.isreal(expo)) {
            return [TFLAG_DIFF, predicate_return_value(true, $)];
        } else {
            return [TFLAG_DIFF, predicate_return_value(false, $)];
        }
    }
}

export const is_real_pow_e_sym = mkbuilder(Op);
