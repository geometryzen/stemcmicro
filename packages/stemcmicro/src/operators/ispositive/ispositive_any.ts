import { Native, native_sym } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { is_any } from "../helpers/is_any";
import { Predicate1 } from "../helpers/Predicate1";

export const ISPOS = native_sym(Native.ispositive);

class Op extends Predicate1<U> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("ispositive_any", ISPOS, is_any, config);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(): boolean {
        return false;
    }
}

export const ispositive_any = mkbuilder(Op);
