import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_RAT } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/rat_extension";
import { is_mul_2_rat_any } from "./is_mul_2_rat_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Combines adjacent number factors when an expression is in right-associated form. 
 * 
 * Rat1 * (Rat2 * X) => (Rat1 * Rat2) * X => Rat3 * X
 * 
 * Transform is redundant because it can be replaced by change of association and Rat + Rat.
 */
class Op extends Function2<Rat, BCons<Sym, Rat, U>> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_rat_mul_2_rat_any', MATH_MUL, is_rat, and(is_cons, is_mul_2_rat_any), $);
        this.hash = hash_binop_atom_cons(MATH_MUL, HASH_RAT, MATH_MUL);
    }
    transform2(opr: Sym, lhs: Rat, rhs: BCons<Sym, Rat, U>): [TFLAGS, U] {
        const $ = this.$;
        const num1 = lhs;
        const num2 = rhs.lhs;
        const r1r2 = num1.mul(num2);
        const X = rhs.rhs;
        const vX = $.valueOf(X);
        const S = items_to_cons(MATH_MUL, r1r2, vX);
        const vS = $.valueOf(S);
        return [TFLAG_DIFF, vS];
    }
}

export const mul_2_rat_mul_2_rat_any = new Builder();
