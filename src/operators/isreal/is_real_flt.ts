import { Flt, is_flt } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { Predicate1 } from "../helpers/Predicate1";

class IsRealFlt extends Predicate1<Flt> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('is_real_flt', native_sym(Native.isreal), is_flt, config);
        this.#hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(): boolean {
        return true;
    }
}

export const is_real_flt = mkbuilder(IsRealFlt);
