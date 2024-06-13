import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const ADD = native_sym(Native.add);
const RECT = native_sym(Native.rect);

/**
 * rect(a + b + ...) = rect(a) + rect(b) + ...
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RECT, ADD);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, $.toInfixString(innerExpr));
        return [TFLAG_DIFF, $.add(...innerExpr.argList.map($.rect))];
    }
}

export const rect_add = mkbuilder(Op);
