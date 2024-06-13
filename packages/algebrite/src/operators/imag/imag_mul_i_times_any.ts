import { count_factors } from "@stemcmicro/helpers";
import { remove_factors } from "../../calculators/remove_factors";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { is_imu } from "../imu/is_imu";

const RE = native_sym(Native.real);
const MUL = native_sym(Native.multiply);
const IM = native_sym(Native.imag);

/**
 * im(i*z) => re(z)
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(IM, MUL);
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr, $)) {
            const innerExpr = expr.argList.head;
            return count_factors(innerExpr, is_imu) === 1;
        } else {
            return false;
        }
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const z = remove_factors(innerExpr, is_imu);
        const re_z = $.valueOf(items_to_cons(RE, z));
        return [TFLAG_DIFF, re_z];
    }
}

export const imag_mul_i_times_any = mkbuilder(Op);
