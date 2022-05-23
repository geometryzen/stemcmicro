import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_mul_2_rat_any } from "../mul/is_mul_2_rat_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross(lhs: BCons<Sym, Rat, U>, rhs: U): boolean {
    const x1 = lhs.rhs;
    const x2 = rhs;
    if (x1.equals(x2)) {
        return true;
    }
    return false;
}

/**
 * (Rat * x) + x => (succ(Rat)) * x
 */
class Op extends Function2X<BCons<Sym, Rat, U>, U> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_mul_2_rat_any_any', MATH_ADD, and(is_cons, is_mul_2_rat_any), is_any, cross, $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_MUL, HASH_ANY);
    }
    transform2(opr: Sym, lhs: BCons<Sym, Rat, U>, rhs: U): [TFLAGS, U] {
        return [TFLAG_DIFF, makeList(MATH_MUL, lhs.lhs.succ(), rhs)];
    }
}

export const add_2_mul_2_rat_anX_anX = new Builder();
