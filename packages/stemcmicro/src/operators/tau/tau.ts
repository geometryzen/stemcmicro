import { Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { two } from "../../tree/rat/Rat";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

const PI = native_sym(Native.PI);
const MATH_TAU = native_sym(Native.tau);

/**
 * (tau x) => (* 2 pi x)
 */
class Op extends Function1<U> implements Extension<U> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super("tau_any", MATH_TAU, is_any);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: U, expr: Cons1<Sym, U>, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, tau_(arg, $)];
    }
}

function tau_(x: U, $: Pick<ExtensionEnv, "multiply">): U {
    const two_pi = $.multiply(two, PI);
    return $.multiply(two_pi, x);
}

export const tau_builder = mkbuilder(Op);
