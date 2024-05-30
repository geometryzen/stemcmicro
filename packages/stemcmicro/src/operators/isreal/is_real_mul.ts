import { Boo, booF, booT, one, Rat, Sym, zero } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { CompositeOperator } from "../helpers/CompositeOperator";

class Op extends CompositeOperator {
    readonly #true: Boo | Rat;
    readonly #false: Boo | Rat;
    constructor(readonly config: Readonly<EnvConfig>) {
        super(native_sym(Native.isreal), native_sym(Native.multiply));
        this.#true = config.useIntegersForPredicates ? one : booT;
        this.#false = config.useIntegersForPredicates ? zero : booF;
    }
    transform1(opr: Sym, inner: Cons, outer: Cons, $: ExtensionEnv): [TFLAGS, U] {
        if (
            [...inner.argList].every(function (arg) {
                return $.isreal(arg);
            })
        ) {
            return [TFLAG_DIFF, this.#true];
        } else {
            return [TFLAG_DIFF, this.#false];
        }
    }
}

export const is_real_mul = mkbuilder(Op);
