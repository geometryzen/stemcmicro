import { Sym } from "@stemcmicro/atoms";
import { predicate_return_value } from "@stemcmicro/helpers";
import { Cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { ISREAL, REAL } from "../../runtime/constants";
import { CompositeOperator } from "../helpers/CompositeOperator";

/**
 * isreal(re(z)) is always true because re(z) always return a real number.
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ISREAL, REAL);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, add: Cons, expr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, predicate_return_value(true, $)];
    }
}

export const is_real_real = mkbuilder(Op);
