import { half } from "@stemcmicro/atoms";
import { contains_single_blade } from "@stemcmicro/helpers";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { Cons1 } from "../helpers/Cons1";
import { simplify } from "../simplify/simplify";

const abs = native_sym(Native.abs);
const add = native_sym(Native.add);

/**
 *
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(abs, add);
    }
    isKind(expr: U, $: ExtensionEnv): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr, $)) {
            const addExpr = expr.argList.head;
            const terms: U[] = addExpr.tail();
            return terms.some(contains_single_blade);
        } else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(innerExpr));
        const retval = $.valueOf(simplify($.power($.inner(innerExpr, innerExpr), half), $));
        return [TFLAG_DIFF, retval];
    }
}

export const abs_add_blades = mkbuilder(Op);
