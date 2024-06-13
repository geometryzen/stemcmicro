import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const LOG = native_sym(Native.log);
const POW = native_sym(Native.pow);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(LOG, POW);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(innerExpr));
        return [TFLAG_DIFF, $.multiply(innerExpr.expo, $.log(innerExpr.base))];
    }
}

export const log_pow = mkbuilder(Op);
