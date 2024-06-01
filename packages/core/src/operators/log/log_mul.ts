import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { cons, Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const ADD = native_sym(Native.add);
const LOG = native_sym(Native.log);
const MUL = native_sym(Native.multiply);

/**
 * log(a * b * ...) = log(a) + log(b) + ...
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(LOG, MUL);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, $.toInfixString(innerExpr));
        return [TFLAG_DIFF, $.valueOf(cons(ADD, innerExpr.argList.map($.log)))];
    }
}

export const log_mul = mkbuilder(Op);
