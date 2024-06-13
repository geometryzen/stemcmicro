import { Sym, zero } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hook_create_err } from "../../hooks/hook_create_err";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { assert_sym } from "../sym/assert_sym";
import { is_sym } from "../sym/is_sym";

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
            return is_sym(x);
        } else {
            return false;
        }
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const x = assert_sym(innerExpr.argList.head);
        const props = $.getSymbolPredicates(x);
        if (props.zero) {
            // Minus infinity in the limit but undefined at zero.
            return [TFLAG_DIFF, hook_create_err(innerExpr)];
        } else if (props.negative) {
            // Complex
            throw new Error($.toInfixString(x));
        } else {
            return [TFLAG_DIFF, zero];
        }
    }
}

export const imag_log_sym = mkbuilder(Op);
