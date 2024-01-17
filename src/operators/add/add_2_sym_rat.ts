
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Sym + Rat => Rat + Sym
 */
class Op extends Function2<Sym, Rat> implements Operator<BCons<Sym, Sym, Rat>> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_sym_rat', MATH_ADD, is_sym, is_rat, $);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_SYM, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Sym, rhs: Rat): [TFLAGS, U] {
        if (rhs.isZero()) {
            return [TFLAG_DIFF, lhs];
        }
        else {
            const $ = this.$;
            return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, rhs, lhs))];
        }
    }
}

export const add_2_sym_rat = new Builder();
