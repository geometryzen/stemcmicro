import { is_rat, Rat } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { Predicate1 } from "../helpers/Predicate1";

const ISINFINITESIMAL = native_sym(Native.isinfinitesimal);

type ARG = Rat;

class Op extends Predicate1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("isinfinitesimal_rat", ISINFINITESIMAL, is_rat, config);
        this.#hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(arg: ARG): boolean {
        return arg.isZero();
    }
}

export const isinfinitesimal_rat = mkbuilder(Op);
