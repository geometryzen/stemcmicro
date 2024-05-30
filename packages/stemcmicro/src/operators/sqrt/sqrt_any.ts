import { Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons1, U } from "@stemcmicro/tree";
import { Extension, ExtensionBuilder, ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { half } from "../../tree/rat/Rat";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new Sqrt();
    }
}

/**
 * sqrt(x) => (pow x 1/2)
 */
class Sqrt extends Function1<U> {
    readonly #hash: string;
    constructor() {
        super("sqrt_any", native_sym(Native.sqrt), is_any);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY); // (sqrt U)
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: U, expr: Cons1<Sym, U>, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(arg));
        return [TFLAG_DIFF, $.power(arg, half)];
    }
}

export const sqrt_any = new Builder();
