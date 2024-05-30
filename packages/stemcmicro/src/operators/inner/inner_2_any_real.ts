import { one, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { isone } from "../../helpers/isone";
import { isreal } from "../../helpers/isreal";
import { items_to_cons } from "../../makeList";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type LHS = U;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

function is_real(expr: LHS, $: ExprContext): expr is U {
    if (isone(expr, $)) {
        return false;
    }
    return isreal(expr, $);
}

/**
 * X | Y => (X|1) * Y, when Y is real.
 */
class Op extends Function2<LHS, RHS> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super("inner_2_any_real", MATH_INNER, is_any, is_real);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const A = $.valueOf(items_to_cons(opr, lhs, one));
        const B = $.valueOf(items_to_cons(MATH_MUL, A, rhs));
        return [TFLAG_DIFF, B];
    }
}

export const inner_2_any_real = mkbuilder<EXP>(Op);
