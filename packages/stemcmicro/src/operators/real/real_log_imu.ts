import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { is_imu } from "../imu/is_imu";

const real = native_sym(Native.real);
const log = native_sym(Native.log);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(real, log);
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr, $)) {
            const logExpr = expr.argList.head;
            const x = logExpr.argList.head;
            return is_imu(x);
        } else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, logExpr: Cons): [TFLAGS, U] {
        return [TFLAG_DIFF, zero];
    }
}

export const real_log_imu = mkbuilder(Op);
