import { is_rat, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hook_create_err } from "../../hooks/hook_create_err";
import { CompositeOperator } from "../helpers/CompositeOperator";

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
            return is_rat(x);
        } else {
            return false;
        }
    }
    transform1(opr: Sym, logExpr: Cons, exp: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const x = logExpr.argList.head;
        if (is_rat(x)) {
            if (x.isZero()) {
                // Minus infinity in the limit but undefined at zero.
                return [TFLAG_DIFF, hook_create_err(logExpr)];
            } else if (x.isNegative()) {
                // Complex
                throw new Error($.toInfixString(x));
            } else {
                // We get to remove the re() wrapper.
                return [TFLAG_DIFF, logExpr];
            }
        } else {
            throw new Error($.toInfixString(x));
        }
    }
}

export const real_log_rat = mkbuilder(Op);
