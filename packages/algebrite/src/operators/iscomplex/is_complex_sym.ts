import { create_boo, is_sym, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";

export const IS_COMPLEX = native_sym(Native.iscomplex);

type ARG = Sym;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("is_complex_sym", IS_COMPLEX, is_sym);
        this.#hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const props = $.getSymbolPredicates(arg);
        return [TFLAG_DIFF, create_boo(props.complex)];
    }
}

export const is_complex_sym = mkbuilder(Op);
