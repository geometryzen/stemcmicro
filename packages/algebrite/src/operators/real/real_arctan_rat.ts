import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { is_rat } from "../rat/is_rat";

const ARCTAN = native_sym(Native.arctan);
const RE = native_sym(Native.real);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RE, ARCTAN);
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr, $)) {
            const innerExpr = expr.argList.head;
            const x = innerExpr.argList.head;
            return is_rat(x);
        } else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons): [TFLAGS, U] {
        // We know that x is a Rat, so it is real.
        // arctan is real if x is real.
        return [TFLAG_DIFF, innerExpr];
    }
}

export const real_arctan_rat = mkbuilder(Op);
