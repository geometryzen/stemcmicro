
import { Native, native_sym } from "math-expression-native";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { Cons1 } from "../helpers/Cons1";

const PI = native_sym(Native.PI);
const MATH_TAU = native_sym(Native.tau);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * (tau x) => (* 2 pi x)
 */
class Op extends Function1<U> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('tau_any', MATH_TAU, is_any, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: U, expr: Cons1<Sym, U>): [TFLAGS, U] {
        return [TFLAG_DIFF, tau_(arg, this.$)];
    }
}

function tau_(x: U, $: Pick<ExtensionEnv, 'multiply'>): U {
    const two_pi = $.multiply(two, PI);
    return $.multiply(two_pi, x);
}

export const tau = new Builder();
