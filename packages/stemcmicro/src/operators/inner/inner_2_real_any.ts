import { one, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Cons2, items_to_cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, MODE_EXPANDING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { isone } from "../../helpers/isone";
import { isreal } from "../../helpers/isreal";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
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
 * X | Y => X * (1 | Y), when X is real.
 */
class Op extends Function2<LHS, RHS> {
    readonly phases = MODE_EXPANDING;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("inner_2_real_any", MATH_INNER, is_real, is_any);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const A = $.valueOf(items_to_cons(opr, one, rhs));
        const B = $.valueOf(items_to_cons(MATH_MUL, lhs, A));
        return [TFLAG_DIFF, B];
    }
}

export const inner_2_real_any = mkbuilder<EXP>(Op);
