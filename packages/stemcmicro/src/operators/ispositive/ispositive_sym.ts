import { is_sym, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionBuilder, ExtensionEnv, Predicates } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Predicate1 } from "../helpers/Predicate1";

class Builder implements ExtensionBuilder<U> {
    constructor(
        readonly predicate: Sym,
        readonly which: (predicates: Predicates) => boolean
    ) {}
    create(config: Readonly<EnvConfig>): Extension<U> {
        return new Op(this.predicate, this.which, config);
    }
}

class Op extends Predicate1<Sym> {
    readonly #hash: string;
    constructor(
        readonly opr: Sym,
        readonly which: (predicates: Predicates) => boolean,
        readonly config: Readonly<EnvConfig>
    ) {
        super("ispositive_sym", opr, is_sym, config);
        this.#hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(arg: Sym, $: ExtensionEnv): boolean {
        const predicates = $.getSymbolPredicates(arg);
        return this.which(predicates);
    }
}

export const ispositive_sym = new Builder(native_sym(Native.ispositive), (predicates: Predicates) => predicates.positive);
