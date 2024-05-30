import { Hyp, is_hyp } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder } from "../../env/ExtensionEnv";
import { HASH_HYP, hash_unaop_atom } from "../../hashing/hash_info";
import { Predicate1 } from "../helpers/Predicate1";

const ISINFINITESIMAL = native_sym(Native.isinfinitesimal);

class Op extends Predicate1<Hyp> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("infinitesimal_hyp", ISINFINITESIMAL, is_hyp, config);
        this.#hash = hash_unaop_atom(this.opr, HASH_HYP);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(): boolean {
        return true;
    }
}

export const isinfinitesimal_hyp = mkbuilder(Op);
