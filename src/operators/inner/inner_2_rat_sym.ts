import { is_rat, is_sym, Rat, Sym } from "math-expression-atoms";
import { items_to_cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { make_extension_builder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

type LHS = Rat;
type RHS = Sym;

/**
 * Rat | x => Rat * x
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('inner_2_rat_sym', MATH_INNER, is_rat, is_sym);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_RAT, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, items_to_cons(MATH_MUL.clone(opr.pos, opr.end), lhs, rhs)];
    }
}

export const inner_2_rat_sym = make_extension_builder(Op);
