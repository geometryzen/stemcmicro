import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const ADD = native_sym(Native.add);
const LOG = native_sym(Native.log);

/**
 *
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(LOG, ADD);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        // const $ = this.$;
        // console.lg(this.name, $.toInfixString(innerExpr));
        return [TFLAG_NONE, outerExpr];
    }
}

export const log_add = mkbuilder(Op);
