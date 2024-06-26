import { is_rat, Sym } from "@stemcmicro/atoms";
import { predicate_return_value } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { CompositeOperator } from "../helpers/CompositeOperator";

const POW = native_sym(Native.pow);
const IS_REAL = native_sym(Native.isreal);

/**
 * isreal(1/z) <=> isreal(z)
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(IS_REAL, POW);
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr, $)) {
            const pow = expr.argList.head;
            const expo = pow.expo;
            return is_rat(expo) && expo.isMinusOne();
        } else {
            return false;
        }
    }
    transform1(opr: Sym, pow: Cons, expr: Cons1<Sym, Cons>, $: ExtensionEnv): [TFLAGS, U] {
        const z = pow.lhs;
        return [TFLAG_DIFF, predicate_return_value($.isreal(z), $)];
    }
}

export const is_real_pow_any_negone = mkbuilder(Op);
