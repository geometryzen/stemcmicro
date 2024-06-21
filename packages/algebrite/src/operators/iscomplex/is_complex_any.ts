import { Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "@stemcmicro/hashing";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

export const IS_COMPLEX = native_sym(Native.iscomplex);

class Op extends Function1<U> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("is_complex_any", IS_COMPLEX, is_any);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: U, expr: U): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const is_complex_any = mkbuilder(Op);
