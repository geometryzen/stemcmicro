import { is_rat, Rat } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "@stemcmicro/hashing";
import { Predicate1 } from "../helpers/Predicate1";

const ISPOS = native_sym(Native.ispositive);

class Op extends Predicate1<Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("ispositive_rat", ISPOS, is_rat, config);
        this.#hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(arg: Rat): boolean {
        return arg.isPositive();
    }
}

export const ispositive_rat = mkbuilder(Op);
