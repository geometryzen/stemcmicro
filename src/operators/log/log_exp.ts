import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const LOG = native_sym(Native.log);
const EXP = native_sym(Native.exp);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(LOG, EXP);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(innerExpr));
        const x = innerExpr.argList.head;
        return [TFLAG_DIFF, x];
    }
}

export const log_exp = mkbuilder<Cons>(Op);
