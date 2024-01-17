
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

type LHS = Rat;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>;

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Rat + Sym => Rat + Sym (Rat != 0)
 *           => Sym       (Rat == 0)
 */
class Op extends Function2<Rat, Sym> implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_rat_sym', MATH_ADD, is_rat, is_sym, $);
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

export const add_2_rat_sym = new Builder();
