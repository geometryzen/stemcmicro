import { Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { CompositeOperator } from "../helpers/CompositeOperator";

const ABS = native_sym(Native.abs);
const MUL = native_sym(Native.multiply);

/**
 * abs(a * b 8 ...) = abs(a) * abs(b) * ...
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ABS, MUL);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, mulExpr: Cons, absExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.multiply(...mulExpr.argList.map($.abs))];
    }
}

export const abs_mul = mkbuilder(Op);

