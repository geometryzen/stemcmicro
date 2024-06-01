import { is_rat, Rat, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons2 } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, mkbuilder } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { Predicate2 } from "../helpers/Predicate2";

export const MATH_LT = native_sym(Native.testlt);

type LHS = Rat;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Predicate2<LHS, RHS> implements Extension<EXP> {
    readonly #hash: string;
    constructor(config: Readonly<EnvConfig>) {
        super("testlt_rat_rat", MATH_LT, is_rat, is_rat, config);
        this.#hash = hash_binop_atom_atom(MATH_LT, HASH_RAT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(lhs: LHS, rhs: RHS): boolean {
        return lhs.compare(rhs) < 0;
    }
}

export const testlt_rat_rat = mkbuilder(Op);
