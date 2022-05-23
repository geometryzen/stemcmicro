
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Cons * Rat => Rat * Cons
 */
class Op extends Function2<Cons, Rat> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_cons_rat', MATH_MUL, is_cons, is_rat, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_ANY, HASH_RAT);
    }
    transform2(opr: Sym, lhs: Cons, rhs: Rat): [TFLAGS, U] {
        const $ = this.$;
        if (rhs.isZero()) {
            return [TFLAG_DIFF, rhs];
        }
        else if (rhs.isOne()) {
            return [TFLAG_DIFF, lhs];
        }
        else {
            return [TFLAG_DIFF, $.valueOf(makeList(opr, rhs, lhs))];
        }
    }
}

export const mul_2_cons_rat = new Builder();

