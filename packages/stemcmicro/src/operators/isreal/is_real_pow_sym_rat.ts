import { assert_rat, assert_sym, is_rat, is_sym, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { predicate_return_value } from "../../helpers/predicate_return_value";
import { two } from "../../tree/rat/Rat";
import { CompositeOperator } from "../helpers/CompositeOperator";

const POW = native_sym(Native.pow);
const IS_REAL = native_sym(Native.isreal);

type ARG = Cons1<Sym, Cons>;
type EXP = Cons1<Sym, ARG>;

/**
 * isreal(z) <=> iszero(im(z))
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(IS_REAL, POW);
    }
    isKind(expr: U, $: ExtensionEnv): expr is EXP {
        if (super.isKind(expr, $)) {
            // console.lg("expr", expr.toString());
            const pow = expr.argList.head;
            // console.lg("pow", pow.toString());
            const base = pow.lhs;
            const expo = pow.rhs;
            return is_sym(base) && is_rat(expo);
            // return true;
        } else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, pow: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const base = assert_sym(pow.lhs);
        const expo = assert_rat(pow.rhs);
        const numer = expo.numer();
        const denom = expo.denom();
        if ($.isreal(base)) {
            if (numer.div(two).isInteger()) {
                if (denom.isOne()) {
                    return [TFLAG_DIFF, predicate_return_value(true, $)];
                }
            } else if (numer.isMinusOne()) {
                if (denom.isOne()) {
                    // Duplicates rule in is_real_pow_ant_negone.
                    return [TFLAG_DIFF, predicate_return_value($.isreal(base), $)];
                }
            }
        }
        return [TFLAG_DIFF, predicate_return_value(false, $)];
        // const denom = expo.denom();
        // We can improve on this...
    }
}

export const is_real_pow_sym_rat = mkbuilder<EXP>(Op);
