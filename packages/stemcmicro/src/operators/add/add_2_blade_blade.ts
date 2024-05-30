import { Blade, create_int, is_blade, Sym } from "math-expression-atoms";
import { Cons2, items_to_cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, SIGN_EQ, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { compare_blade_blade } from "../blade/blade_extension";
import { Function2 } from "../helpers/Function2";

type LHS = Blade;
type RHS = Blade;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Blade + Blade
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_blade_blade", MATH_ADD, is_blade, is_blade);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_BLADE, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: LHS, expr: EXP): [TFLAGS, U] {
        switch (compare_blade_blade(lhs, rhs)) {
            case SIGN_GT: {
                return [TFLAG_DIFF, items_to_cons(opr, rhs, lhs)];
            }
            case SIGN_EQ: {
                return [TFLAG_DIFF, items_to_cons(MATH_MUL, create_int(2), lhs)];
            }
            default: {
                return [TFLAG_HALT, expr];
            }
        }
    }
}

export const add_2_blade_blade = mkbuilder(Op);
