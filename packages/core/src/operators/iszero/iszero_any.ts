import { booF, Sym } from "@stemcmicro/atoms";
import { predicate_return_value } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons1, is_atom, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

const ISZERO = native_sym(Native.iszero);

class Op extends Function1<U> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("iszero_any", ISZERO, is_any);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: U, expr: Cons1<Sym, U>, $: ExtensionEnv): [TFLAGS, U] {
        if (is_atom(arg)) {
            const handler = $.handlerFor(arg);
            return [TFLAG_NONE, predicate_return_value(handler.test(arg, ISZERO, $), $)];
        } else {
            return [TFLAG_NONE, booF];
        }
    }
}

export const iszero_any = mkbuilder<Cons1<Sym, U>>(Op);
