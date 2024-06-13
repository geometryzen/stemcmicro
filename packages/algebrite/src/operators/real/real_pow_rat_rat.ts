import { assert_rat, is_rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { Cons1 } from "../helpers/Cons1";

const PI = native_sym(Native.PI);
const POW = native_sym(Native.pow);
const RE = native_sym(Native.real);

/**
 *
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(RE, POW);
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr, $)) {
            const innerExpr = expr.argList.head;
            const base = innerExpr.lhs;
            const expo = innerExpr.rhs;
            return is_rat(base) && is_rat(expo);
        } else {
            return false;
        }
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // TODO: What do we do about roots of unity?
        const base = assert_rat(innerExpr.lhs);
        // console.lg("base",$.toInfixString(base));
        if (base.isMinusOne()) {
            // We have a clock form z = (-1)^s.
            // x+iy = (-1)^s
            // log(x+iy) = s*log(-1) = s*i*pi
            // x+iy = exp(i*s*pi) = cos(s*pi)+i*sin(s*pi)
            const s = assert_rat(innerExpr.rhs);
            return [TFLAG_DIFF, $.cos($.multiply(s, PI))];
        } else if (base.isPositive()) {
            return [TFLAG_DIFF, innerExpr];
        } else {
            // const expo = assert_rat(innerExpr.rhs);
            return [TFLAG_DIFF, outerExpr];
        }
    }
}

export const real_pow_rat_rat = mkbuilder(Op);
