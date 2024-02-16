import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, SIGN_GT, SIGN_LT, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

/**
 * b + a => a + b
 * a + a => 2 * a
 */
class Op extends Function2<Sym, Sym> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('add_2_sym_sym', MATH_ADD, is_sym, is_sym);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_SYM, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Sym, rhs: Sym, orig: Cons2<Sym, Sym, Sym>): [TFLAGS, U] {
        switch (compare_sym_sym(lhs, rhs)) {
            case SIGN_GT: {
                return [TFLAG_DIFF, items_to_cons(opr, rhs, lhs)];
            }
            case SIGN_LT: {
                return [TFLAG_HALT, orig];
            }
            default: {
                if (lhs.equals(rhs)) {
                    return [TFLAG_DIFF, items_to_cons(MATH_MUL.clone(opr.pos, opr.end), two, lhs)];
                }
                else {
                    return [TFLAG_HALT, orig];
                }
            }
        }
    }
}

export const add_2_sym_sym = mkbuilder(Op);
