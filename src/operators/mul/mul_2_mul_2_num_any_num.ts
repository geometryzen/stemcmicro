import { multiply_num_num } from "../../calculators/mul/multiply_num_num";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { is_num } from "../../predicates/is_num";
import { MATH_MUL } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
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

/**
 * (Rat1 * X) * Rat2 => (Rat1 * Rat2) * X
 * 
 * More fundamentally,
 * 
 * (Rat1 * X) * Rat2 => Rat1 * (X * Rat2) => Rat1 * (Rat2 * X) => (Rat1 * Rat2) * X
 */
class Op extends Function2<BCons<Sym, Num, U>, Num> implements Operator<Cons> {
    readonly breaker = true;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_num_any_num', MATH_MUL, and(is_cons, is_mul_2_num_any), is_num, $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, Num, U>, rhs: Num): [TFLAGS, U] {
        const num1 = lhs.lhs;
        const X = lhs.rhs;
        const num2 = rhs;
        return [CHANGED, makeList(MATH_MUL, X, multiply_num_num(num1, num2))];
    }
}

export const mul_2_mul_2_num_any_num = new Builder();
