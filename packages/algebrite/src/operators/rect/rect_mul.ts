import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { Cons1 } from "../helpers/Cons1";

const RECT = native_sym(Native.rect);
const MUL = native_sym(Native.multiply);

/**
 *
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RECT, MUL);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, expr: Cons1<Sym, Cons>, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(innerExpr));
        const factors = innerExpr.tail().map($.rect);
        return [TFLAG_DIFF, $.multiply(...factors)];
    }
}

export const rect_mul = mkbuilder(Op);
