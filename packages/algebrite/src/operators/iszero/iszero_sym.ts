import { is_sym, Sym } from "@stemcmicro/atoms";
import { predicate_return_value } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons1, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "@stemcmicro/hashing";
import { Function1 } from "../helpers/Function1";

const ISZERO = native_sym(Native.iszero);

class Op extends Function1<Sym> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("iszero_sym", ISZERO, is_sym);
        this.#hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Sym, exp: Cons1<Sym, U>, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(arg));
        const predicates = $.getSymbolPredicates(arg);
        return [TFLAG_DIFF, predicate_return_value(predicates.zero, $)];
    }
}

export const iszero_sym_builder = mkbuilder(Op);
