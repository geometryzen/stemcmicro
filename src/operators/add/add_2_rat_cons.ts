
import { TFLAG_DIFF, ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Rat(0) + Cons => Cons
 */
class Op extends Function2<Rat, Cons> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_rat_cons', MATH_ADD, is_rat, is_cons, $);
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_RAT, HASH_ANY);
    }
    transform2(opr: Sym, lhs: Rat, rhs: Cons, orig: BCons<Sym, Rat, Cons>): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [TFLAG_DIFF, rhs];
        }
        return [TFLAG_NONE, orig];
    }
}

export const add_2_rat_cons = new Builder();
