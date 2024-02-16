
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

type LHS = Rat;
type RHS = Sym;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Rat + Sym => Rat + Sym (Rat != 0)
 *           => Sym       (Rat == 0)
 */
class Op extends Function2<Rat, Sym> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('add_2_rat_sym', MATH_ADD, is_rat, is_sym);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_RAT, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    override transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [TFLAG_DIFF, rhs];
        }
        return [TFLAG_HALT, orig];
    }
}

export const add_2_rat_sym = mkbuilder(Op);
