import { add_num_num } from "../../calculators/add/add_num_num";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_num_any } from "../mul/is_mul_2_num_any";
import { is_add_2_num_mul_2_num_any } from "./is_add_2_num_mul_2_num_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * 
 */
function cross(lhs: BCons<Sym, Num, BCons<Sym, Num, U>>, rhs: BCons<Sym, Num, U>): boolean {
    const x1 = lhs.rhs.rhs;
    const x2 = rhs.rhs;
    return x1.equals(x2);
}

/**
 * TODO: If this expression is driven towards either of the Left- or Right-associated forms then it could
 * be handled by alternative matching transformers?
 * 
 * (k + (m * X)) + (n * X) => k + (m + n) * X
 */
class Op extends Function2X<BCons<Sym, Num, BCons<Sym, Num, U>>, BCons<Sym, Rat, U>> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_add_2_any_mul_2_rat_any_add_2_rat_any', MATH_ADD, and(is_cons, is_add_2_num_mul_2_num_any), and(is_cons, is_mul_2_num_any), cross, $);
        this.hash = hash_binop_cons_cons(MATH_ADD, MATH_ADD, MATH_MUL);
    }
    transform2(opr: Sym, lhs: BCons<Sym, Num, BCons<Sym, Num, U>>, rhs: BCons<Sym, Num, U>): [TFLAGS, U] {
        const k = lhs.lhs;
        const m = lhs.rhs.lhs;
        const n = rhs.lhs;
        const mn = add_num_num(m, n);
        return [TFLAG_DIFF, makeList(MATH_ADD, k, makeList(MATH_MUL, mn, rhs.rhs))];
    }
}

export const add_2_add_2_rat_mul_2_rat_any_add_2_rat_any = new Builder();
