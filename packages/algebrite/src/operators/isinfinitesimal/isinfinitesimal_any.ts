import { Native, native_sym } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "@stemcmicro/hashing";
import { is_any } from "../helpers/is_any";
import { Predicate1 } from "../helpers/Predicate1";

export const ISINFINITESIMAL = native_sym(Native.isinfinitesimal);

class Op extends Predicate1<U> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("isinfinitesimal_any", ISINFINITESIMAL, is_any, config);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(): boolean {
        return false;
    }
}

export const isinfinitesimal_any = mkbuilder(Op);
