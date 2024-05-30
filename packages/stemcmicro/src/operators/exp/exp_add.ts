import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const ADD = native_sym(Native.add);
const EXP = native_sym(Native.exp);

/**
 * exp(a + b + ...) = exp(a) * exp(b) * ...
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(EXP, ADD);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, addExpr: Cons, expExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, $.toInfixString(addExpr));
        return [TFLAG_DIFF, $.multiply(...addExpr.argList.map($.exp))];
    }
}

export const exp_add = mkbuilder(Op);
