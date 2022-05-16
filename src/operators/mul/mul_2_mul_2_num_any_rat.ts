import { multiply_num_num } from "../../calculators/mul/multiply_num_num";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_RAT } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_num_any } from "./is_mul_2_num_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = Num;
type LR = U;
type LHS = BCons<Sym, LL, LR>;
type RHS = Rat;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * (Rat1 * X) * Rat2 => (Rat1 * Rat2) * X
 * 
 * More fundamentally,
 * 
 * (Rat1 * X) * Rat2 => Rat1 * (X * Rat2) => Rat1 * (Rat2 * X) => (Rat1 * Rat2) * X
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly breaker = true;
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_num_any_rat', MATH_MUL, and(is_cons, is_mul_2_num_any), is_rat, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_RAT);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const num1 = lhs.lhs;
        const X = lhs.rhs;
        const num2 = rhs;
        return [CHANGED, makeList(MATH_MUL, X, multiply_num_num(num1, num2))];
    }
}

export const mul_2_mul_2_num_any_rat = new Builder();
