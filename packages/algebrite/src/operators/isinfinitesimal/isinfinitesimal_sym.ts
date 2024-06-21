import { is_sym, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "@stemcmicro/hashing";
import { Predicate1 } from "../helpers/Predicate1";

const ISINFINITESIMAL = native_sym(Native.isinfinitesimal);

class Op extends Predicate1<Sym> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("infinitesimal_sym", ISINFINITESIMAL, is_sym, config);
        this.#hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(arg: Sym, $: ExtensionEnv): boolean {
        const props = $.getSymbolPredicates(arg);
        return props.infinitesimal;
    }
}

export const isinfinitesimal_sym = mkbuilder(Op);
