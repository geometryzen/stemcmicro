
import { Native, native_sym } from "math-expression-native";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";

const Pi = native_sym(Native.mathematical_constant_Pi);
const MATH_TAU = native_sym(Native.tau);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * (tau x) => (* 2 :Math/Pi x)
 */
class Op extends Function1<U> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('tau_any', MATH_TAU, is_any, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: U, expr: UCons<Sym, U>): [TFLAGS, U] {
        return [TFLAG_DIFF, tau_(arg, this.$)];
    }
}

function tau_(x: U, $: Pick<ExtensionEnv, 'multiply'>): U {
    const two_pi = $.multiply(two, Pi);
    return $.multiply(two_pi, x);
}

export const tau = new Builder();
