import { is_sym, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Predicate1 } from "../helpers/Predicate1";

const ISINFINITESIMAL = native_sym(Native.isinfinitesimal);

class Op extends Predicate1<Sym> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('infinitesimal_sym', ISINFINITESIMAL, is_sym, config);
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
