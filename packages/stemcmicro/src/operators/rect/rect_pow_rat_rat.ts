import { assert_rat, is_rat, Sym } from "math-expression-atoms";
import { Cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { Cons1 } from "../helpers/Cons1";

const rect = native_sym(Native.rect);
const pow = native_sym(Native.pow);

/**
 *
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(rect, pow);
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr, $)) {
            const powExpr = expr.argList.head;
            const base = powExpr.base;
            const expo = powExpr.expo;
            return is_rat(base) && is_rat(expo);
        } else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, powExpr: Cons, rectExpr: Cons1<Sym, Cons>): [TFLAGS, U] {
        const base = assert_rat(powExpr.base);
        // const expo = assert_rat(powExpr.expo);
        if (base.isPositive()) {
            return [TFLAG_DIFF, powExpr];
        }
        return [TFLAG_DIFF, rectExpr];
    }
}

export const rect_pow_rat_rat = mkbuilder(Op);
