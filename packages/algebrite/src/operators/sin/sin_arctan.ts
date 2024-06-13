import { negHalf, one, two } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const SIN = native_sym(Native.sin);
const ARCTAN = native_sym(Native.arctan);

/**
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(SIN, ARCTAN);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const x = innerExpr.argList.head;
        // see p. 173 of the CRC Handbook of Mathematical Sciences, or
        // https://www.rapidtables.com/math/trigonometry/arctan.html
        // x / sqrt(1+x^2)
        const x_squared = $.power(x, two);
        const one_plus_x_squared = $.add(one, x_squared);
        return [TFLAG_DIFF, $.multiply(x, $.power(one_plus_x_squared, negHalf))];
    }
}

export const sin_arctan = mkbuilder(Op);
