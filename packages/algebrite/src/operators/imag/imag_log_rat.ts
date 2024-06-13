import { zero } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hook_create_err } from "../../hooks/hook_create_err";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { is_rat } from "../rat/is_rat";

const imag = native_sym(Native.imag);
const log = native_sym(Native.log);

class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(imag, log);
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
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const x = innerExpr.argList.head;
        if (is_rat(x)) {
            if (x.isZero()) {
                // Minus infinity in the limit but undefined at zero.
                return [TFLAG_DIFF, hook_create_err(innerExpr)];
            } else if (x.isNegative()) {
                // Complex
                throw new Error($.toInfixString(x));
            } else {
                return [TFLAG_DIFF, zero];
            }
        } else {
            throw new Error($.toInfixString(x));
        }
    }
}

export const imag_log_rat = mkbuilder(Op);
