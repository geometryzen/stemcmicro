import { Flt, is_flt } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { Predicate1 } from "../helpers/Predicate1";

const ISPOS = native_sym(Native.ispositive);

class Op extends Predicate1<Flt> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("ispositive_flt", ISPOS, is_flt, config);
        this.#hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(arg: Flt): boolean {
        return arg.isPositive();
    }
}

export const ispositive_flt = mkbuilder(Op);
