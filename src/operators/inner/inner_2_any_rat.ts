import { is_rat, Rat, Sym } from "math-expression-atoms";
import { Cons2, items_to_cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type LHS = U;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * 
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('inner_2_any_rat', MATH_INNER, is_any, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_ANY, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        if (rhs.isOne()) {
            return [TFLAG_DIFF, lhs];
        }
        else {
            return [TFLAG_DIFF, items_to_cons(MATH_MUL.clone(opr.pos, opr.end), lhs, rhs)];
        }
    }
}

export const inner_2_any_rat = mkbuilder<EXP>(Op);
