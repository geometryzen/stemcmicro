import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const COS = native_sym(Native.cos);
const RECT = native_sym(Native.rect);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RECT, COS);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, cosExpr: Cons, rectExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const cosArg = cosExpr.arg;
        if ($.isreal(cosArg)) {
            return [TFLAG_DIFF, cosExpr];
        }
        return [TFLAG_NONE, rectExpr];
    }
}

export const rect_cos = mkbuilder(Op);
