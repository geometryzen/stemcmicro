import { Sym } from "@stemcmicro/atoms";
import { predicate_return_value } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { ISREAL } from "../../runtime/constants";
import { CompositeOperator } from "../helpers/CompositeOperator";

export const MATH_SIN = native_sym(Native.sin);

/**
 * isreal(sin(z)) => isreal(z)
 */
class IsRealSin extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ISREAL, MATH_SIN);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, sinExpr: Cons, expr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const x = sinExpr.argList.head;
        return [TFLAG_DIFF, predicate_return_value($.isreal(x), $)];
    }
}

export const is_real_sin = mkbuilder(IsRealSin);
