
import { Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons1, U } from "math-expression-tree";
import { Extension, ExtensionBuilder, ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { two } from "../../tree/rat/Rat";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

const PI = native_sym(Native.PI);
const MATH_TAU = native_sym(Native.tau);

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new Op();
    }
}

/**
 * (tau x) => (* 2 pi x)
 */
class Op extends Function1<U> implements Extension<U> {
    constructor() {
        super('tau_any', MATH_TAU, is_any);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: U, expr: Cons1<Sym, U>, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, tau_(arg, $)];
    }
}

function tau_(x: U, $: Pick<ExtensionEnv, 'multiply'>): U {
    const two_pi = $.multiply(two, PI);
    return $.multiply(two_pi, x);
}

export const tau_builder = new Builder();
