import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_GT } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons2 } from "../helpers/Cons2";
import { Predicate2 } from "../helpers/Predicate2";
import { is_rat } from "../rat/is_rat";

type LHS = Rat;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Predicate2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("testgt_rat_rat", MATH_GT, is_rat, is_rat, config);
        this.#hash = hash_binop_atom_atom(MATH_GT, HASH_RAT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(lhs: LHS, rhs: RHS): boolean {
        return lhs.compare(rhs) > 0;
    }
}

export const testgt_rat_rat = mkbuilder<EXP>(Op);
