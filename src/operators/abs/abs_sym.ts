import { EnvConfig } from "../../env/EnvConfig";
import { Directive, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { two, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";

/**
 * abs(x) => (sqrt (pow x 2))
 */
class Op extends Function1<Sym> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super('abs_sym', native_sym(Native.abs), is_sym);
    }
    transform1(opr: Sym, x: Sym, origExpr: Cons1<Sym, Sym>, $: ExtensionEnv): [TFLAGS, U] {
        const props = $.getSymbolPredicates(x);
        if (props.positive) {
            return [TFLAG_DIFF, x];
        }
        if (props.negative) {
            return [TFLAG_DIFF, $.negate(x)];
        }
        if (props.zero) {
            return [TFLAG_DIFF, zero];
        }
        if (props.real) {
            if ($.getDirective(Directive.expanding)) {
                return [TFLAG_DIFF, $.sqrt($.power(x, two))];
            }
        }
        return [TFLAG_NONE, origExpr];
    }
}

export const abs_sym = mkbuilder(Op);
