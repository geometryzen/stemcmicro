
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { is_rat } from "../rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

export const add_2_cons_rat = new Builder();

/**
 * Cons + Rat => Rat + Cons
 */
class Op extends Function2<Cons, Rat> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_cons_rat', MATH_ADD, is_cons, is_rat, $);
        // IMPROVE: Not a very precise hash...
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_ANY, HASH_RAT);
    }
    transform2(opr: Sym, lhs: Cons, rhs: Rat): [TFLAGS, U] {
        if (rhs.isZero()) {
            return [TFLAG_DIFF, lhs];
        }
        else {
            const $ = this.$;
            return [TFLAG_DIFF, $.valueOf(makeList(opr, rhs, lhs))];
        }
    }
}
